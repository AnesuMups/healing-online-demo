"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { getAdminStats, type AdminStats } from "@/lib/api"
import { Users, CreditCard, DollarSign, Clock } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminStats().then((data) => {
      setStats(data)
      setLoading(false)
    })
  }, [])

  const statCards = stats
    ? [
        { label: "Total Patients", value: stats.totalPatients, icon: Users, color: "text-primary" },
        { label: "Active Subscriptions", value: stats.activeSubscriptions, icon: CreditCard, color: "text-blue-600" },
        { label: "Monthly Sales", value: `$${stats.monthlySales.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600" },
        { label: "Pending Consultations", value: stats.pendingConsultations, icon: Clock, color: "text-amber-600" },
      ]
    : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of platform performance and patient management</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border border-border">
              <CardContent className="p-6">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <Card key={card.label} className="border border-border bg-background">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{card.label}</span>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
