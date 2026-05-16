import { prisma } from "@/lib/prisma"

interface TransactionWithCategory {
    id: string
    date: Date
    description: string | null
    paymentMethod: string
    type: 'INCOME' | 'EXPENSE' | string
    amount: any
    category: {
        name: string
    }
}

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { TransactionForm } from "@/components/transaction-form"
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
import { DeleteTransactionButton } from "@/components/delete-transaction-button"

export default async function TransactionsPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const [transactions, categories] = await Promise.all([
        prisma.transaction.findMany({
            where: { userId: session.user.id },
            include: { category: true },
            orderBy: { date: 'desc' }
        }),
        prisma.category.findMany({
            where: { userId: session.user.id },
            orderBy: { name: 'asc' }
        })
    ])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                <TransactionForm categories={categories} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction: TransactionWithCategory) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{format(transaction.date, "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{transaction.category.name}</Badge>
                                    </TableCell>
                                    <TableCell>{transaction.description || "-"}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{transaction.paymentMethod.replace("_", " ")}</TableCell>
                                    <TableCell className={`text-right font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {transaction.type === 'INCOME' ? '+' : '-'}฿{Number(transaction.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <DeleteTransactionButton id={transaction.id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No transactions found.
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
