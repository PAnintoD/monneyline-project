import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Settings functionality coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
