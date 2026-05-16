import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    req: Request,
    { params }: any
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { categoryId } = await params

        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
        }

        const category = await prisma.category.deleteMany({
            where: {
                id: categoryId,
                userId: session.user.id,
            },
        })

        return NextResponse.json(category)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
