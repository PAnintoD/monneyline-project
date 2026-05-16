import { prisma } from "@/lib/prisma"
import { addDays, addWeeks, addMonths, addYears, isBefore, isSameDay } from "date-fns"

export async function processRecurringTransactions(userId: string) {
    const recurring = await prisma.recurringTransaction.findMany({
        where: {
            userId,
            isActive: true,
            nextRunDate: {
                lte: new Date()
            }
        }
    })

    for (const item of recurring) {
        // Create the transaction
        await prisma.transaction.create({
            data: {
                userId: item.userId,
                categoryId: item.categoryId,
                amount: item.amount,
                type: item.type,
                date: new Date(), // Transaction date is today
                description: `(Recurring) ${item.description || "Auto-generated"}`,
                paymentMethod: "CASH", // Default
            }
        })

        // Calculate next run date
        let nextDate = new Date(item.nextRunDate)
        switch (item.frequency) {
            case "DAILY":
                nextDate = addDays(nextDate, 1)
                break
            case "WEEKLY":
                nextDate = addWeeks(nextDate, 1)
                break
            case "MONTHLY":
                nextDate = addMonths(nextDate, 1)
                break
            case "YEARLY":
                nextDate = addYears(nextDate, 1)
                break
        }

        // Update the recurring record
        await prisma.recurringTransaction.update({
            where: { id: item.id },
            data: { nextRunDate: nextDate }
        })
    }
}
