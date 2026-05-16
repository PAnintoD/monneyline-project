import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { CategoryForm } from "@/components/category-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteCategoryButton } from "@/components/delete-category-button"

interface Category {
    id: string
    name: string
    type: string
}

export default async function CategoriesPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const categories = await prisma.category.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                <CategoryForm />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category: Category) => (
                    <Card key={category.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {category.name}
                            </CardTitle>
                            <Badge variant={category.type === 'INCOME' ? 'default' : 'destructive'}>
                                {category.type}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-end mt-4">
                                <DeleteCategoryButton id={category.id} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {categories.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground p-8">
                        No categories found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
