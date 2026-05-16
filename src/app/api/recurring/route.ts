import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const recurringSchema = z.object({
    amount: z.number().positive(),
    type: z.enum(["INCOME", "EXPENSE"]),
    categoryId: z.string().uuid(),
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    startDate: z.string().datetime(),
    description: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        if (typeof body.amount === 'string') body.amount = parseFloat(body.amount)

        const { amount, type, categoryId, frequency, startDate, description } = recurringSchema.parse(body)

        const recurring = await prisma.recurringTransaction.create({
            data: {
                amount,
                type,
                categoryId,
                frequency,
                startDate: new Date(startDate),
                nextRunDate: new Date(startDate), // First run is on start date
                description,
                userId: session.user.id,
            },
        })

        return NextResponse.json(recurring)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data", { status: 400 })
        }
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const recurring = await prisma.recurringTransaction.findMany({
            where: { userId: session.user.id },
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(recurring)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
