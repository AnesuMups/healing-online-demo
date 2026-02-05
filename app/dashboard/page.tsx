"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getPatientOverview } from "@/lib/api"
import {
  CreditCard,
  Stethoscope,
  FileText,
  CalendarDays,
  ArrowRight,
  ClipboardList,
} from "lucide-react"

interface Overview {
  subscriptionStatus: string
  plan: string
  consultationStatus: string
  submittedRecords: number
  nextAppointment: string
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getPatientOverview(user.id).then((data) => {
        setOverview(data)
        setLoading(false)
      })
    }
  }, [user])

  const statusColors: Record<string, string> = {
    active: "bg-primary/10 text-primary border-primary/20",
    inactive: "bg-destructive/10 text-destructive border-destructive/20",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-primary/10 text-primary border-primary/20",
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here is an overview of your health dashboard
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : overview ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border border-border bg-background">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subscription</span>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">{overview.plan}</span>
                  <Badge variant="outline" className={statusColors[overview.subscriptionStatus] || ""}>
                    {overview.subscriptionStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-background">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Consultation</span>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3">
                  <Badge variant="outline" className={statusColors[overview.consultationStatus] || ""}>
                    {overview.consultationStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-background">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Records</span>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-foreground">{overview.submittedRecords}</span>
                  <span className="ml-1 text-sm text-muted-foreground">submitted</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-background">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Appointment</span>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3">
                  <span className="text-lg font-bold text-foreground">{overview.nextAppointment}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card className="border border-border bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Medical Intake Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Complete your medical intake form to help our doctors understand your health needs better. This multi-step form collects your personal information, medical history, and current ailments.
                </p>
                <Button className="mt-4 gap-2" asChild>
                  <Link href="/dashboard/intake">
                    Start Intake Form <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Your Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View your submitted medical records, consultation history, and treatment notes. Keep track of your health journey in one place.
                </p>
                <Button variant="outline" className="mt-4 gap-2 bg-transparent" asChild>
                  <Link href="/dashboard/records">
                    View Records <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}
