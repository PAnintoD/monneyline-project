"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteCategoryButton({ id }: { id: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function onDelete() {
        if (!confirm("Are you sure you want to delete this category?")) return

        setIsLoading(true)
        try {
            await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            })
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button variant="ghost" size="icon" onClick={onDelete} disabled={isLoading}>
            <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
    )
}
