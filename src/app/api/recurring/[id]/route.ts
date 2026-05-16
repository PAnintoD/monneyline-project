import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await prisma.recurringTransaction.deleteMany({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
