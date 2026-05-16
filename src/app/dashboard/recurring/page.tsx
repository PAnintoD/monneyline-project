import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { RecurringForm } from "@/components/recurring-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DeleteRecurringButton } from "@/components/delete-recurring-button"

export default async function RecurringPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const [recurring, categories] = await Promise.all([
        prisma.recurringTransaction.findMany({
            where: { userId: session.user.id },
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.category.findMany({
            where: { userId: session.user.id },
            orderBy: { name: 'asc' }
        })
    ])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Recurring Transactions</h2>
                <RecurringForm categories={categories} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Scheduled Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Next Run</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recurring.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.description || "Auto-generated"}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.category.name}</Badge>
                                    </TableCell>
                                    <TableCell>{item.frequency}</TableCell>
                                    <TableCell>{format(item.nextRunDate, "MMM d, yyyy")}</TableCell>
                                    <TableCell className={`text-right font-medium ${item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.type === 'INCOME' ? '+' : '-'}฿{Number(item.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <DeleteRecurringButton id={item.id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {recurring.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No recurring transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
