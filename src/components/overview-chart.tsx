"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface OverviewChartProps {
    data: {
        name: string
        income: number
        expense: number
    }[]
}

export function OverviewChart({ data }: OverviewChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `฿${value}`}
                />
                <Tooltip
                    formatter={(value: number) => [`฿${value.toLocaleString()}`, ""]}
                    cursor={{ fill: 'transparent' }}
                />
                <Legend />
                <Bar dataKey="income" fill="oklch(0.6 0.15 160)" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="oklch(0.6 0.2 25)" radius={[4, 4, 0, 0]} name="Expense" />
            </BarChart>
        </ResponsiveContainer>
    )
}
