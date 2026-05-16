import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 })
        }

        const category = await prisma.category.deleteMany({
            where: {
                id: params.categoryId,
                userId: session.user.id,
            },
        })

        return NextResponse.json(category)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
