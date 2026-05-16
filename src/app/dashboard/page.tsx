import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CreditCard, Wallet, TrendingUp } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { OverviewChart } from "@/components/overview-chart"
import { processRecurringTransactions } from "@/lib/recurring-processor"

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const userId = session.user.id

    // Process recurring transactions
    await processRecurringTransactions(userId)

    // Fetch transactions
    const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        include: { category: true }
    })

    // Calculate stats
    const totalIncome = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpense = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const balance = totalIncome - totalExpense

    const recentTransactions = transactions.slice(0, 5)

    // Prepare Chart Data (Last 6 months)
    const chartData = []
    for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i)
        const monthStart = startOfMonth(date)
        const monthEnd = endOfMonth(date)
        const monthName = format(date, "MMM")

        const monthTransactions = transactions.filter(t =>
            t.date >= monthStart && t.date <= monthEnd
        )

        const income = monthTransactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + Number(t.amount), 0)

        const expense = monthTransactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + Number(t.amount), 0)

        chartData.push({ name: monthName, income, expense })
    }

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Balance
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">฿{balance.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Current Net Balance
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Income
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">+฿{totalIncome.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Total Income
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">-฿{totalExpense.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Total Expenses
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Transactions
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transactions.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Total Transactions
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={chartData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentTransactions.map(t => (
                                <div className="flex items-center" key={t.id}>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{t.description || t.category.name}</p>
                                        <p className="text-sm text-muted-foreground">{format(t.date, "MMM d")}</p>
                                    </div>
                                    <div className={`ml-auto font-medium ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'INCOME' ? '+' : '-'}฿{Number(t.amount).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {recentTransactions.length === 0 && (
                                <div className="text-center text-muted-foreground">No transactions yet</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
