import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categorySchema = z.object({
    name: z.string().min(1),
    type: z.enum(["INCOME", "EXPENSE"]),
    color: z.string().optional(),
    icon: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { name, type, color, icon } = categorySchema.parse(body)

        const category = await prisma.category.create({
            data: {
                name,
                type,
                color,
                icon,
                userId: session.user.id,
            },
        })

        return NextResponse.json(category)
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

        const { searchParams } = new URL(req.url)
        const type = searchParams.get("type")

        const categories = await prisma.category.findMany({
            where: {
                userId: session.user.id,
                ...(type ? { type: type as "INCOME" | "EXPENSE" } : {}),
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(categories)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
