"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getPatientRecords, type PatientRecord } from "@/lib/api"
import { FileText, Calendar, Stethoscope } from "lucide-react"

export default function RecordsPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getPatientRecords(user.id).then((data) => {
        setRecords(data)
        setLoading(false)
      })
    }
  }, [user])

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-primary/10 text-primary border-primary/20",
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Medical Records</h1>
        <p className="mt-1 text-muted-foreground">View your submitted medical records and consultation history</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="border border-border">
              <CardContent className="p-6">
                <Skeleton className="mb-3 h-5 w-40" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : records.length === 0 ? (
        <Card className="border border-border bg-background">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">No Records Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Complete your medical intake form to create your first record.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {records.map((record) => (
            <Card key={record.id} className="border border-border bg-background">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-foreground">Medical Record - {record.id}</CardTitle>
                  <Badge variant="outline" className={statusColors[record.consultationStatus] || ""}>
                    {record.consultationStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Submitted: {record.submittedAt}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Stethoscope className="h-4 w-4" />
                    Consultation: {record.consultationStatus}
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-muted p-4">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Medical Summary</h4>
                  <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <p><span className="font-medium text-foreground">History:</span> {record.medicalHistory}</p>
                    <p><span className="font-medium text-foreground">Chronic:</span> {record.chronicCondition ? "Yes" : "No"}</p>
                    <p><span className="font-medium text-foreground">Current condition:</span> {record.currentCondition}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Ailments</h4>
                  <div className="flex flex-wrap gap-2">
                    {record.ailments.map((a) => (
                      <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
