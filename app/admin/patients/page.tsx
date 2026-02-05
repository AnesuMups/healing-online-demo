"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { getAllPatients, type PatientRecord } from "@/lib/api"
import { Search, Eye } from "lucide-react"

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null)

  useEffect(() => {
    getAllPatients().then((data) => {
      setPatients(data)
      setLoading(false)
    })
  }, [])

  const filtered = patients.filter(
    (p) =>
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors: Record<string, string> = {
    active: "bg-primary/10 text-primary border-primary/20",
    inactive: "bg-destructive/10 text-destructive border-destructive/20",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-primary/10 text-primary border-primary/20",
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="mt-1 text-muted-foreground">Manage and view all patient records</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="pl-9"
          />
        </div>
      </div>

      <Card className="border border-border bg-background">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="mb-3 h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Consultation</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{patient.patientName}</div>
                          <div className="text-xs text-muted-foreground">{patient.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{patient.gender}</TableCell>
                      <TableCell className="text-muted-foreground">{patient.age}</TableCell>
                      <TableCell className="text-muted-foreground">{patient.membershipPlan}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[patient.membershipStatus] || ""}>
                          {patient.membershipStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[patient.consultationStatus] || ""}>
                          {patient.consultationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{patient.submittedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(patient)} className="gap-1.5">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                        No patients found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Detail Dialog */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">{selectedPatient.patientName}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Email:</span> <span className="ml-1 text-foreground">{selectedPatient.email}</span></div>
                  <div><span className="text-muted-foreground">Gender:</span> <span className="ml-1 text-foreground">{selectedPatient.gender}</span></div>
                  <div><span className="text-muted-foreground">Age:</span> <span className="ml-1 text-foreground">{selectedPatient.age}</span></div>
                  <div><span className="text-muted-foreground">Plan:</span> <span className="ml-1 text-foreground">{selectedPatient.membershipPlan}</span></div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Medical History</h4>
                  <p className="text-sm text-muted-foreground">{selectedPatient.medicalHistory}</p>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Current Condition</h4>
                  <p className="text-sm text-muted-foreground">{selectedPatient.currentCondition}</p>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Chronic:</span>{" "}
                    <span className="text-foreground">{selectedPatient.chronicCondition ? "Yes" : "No"}</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="text-muted-foreground">Treatments:</span>{" "}
                    <span className="text-foreground">{selectedPatient.otherTreatments || "None"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Ailments</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.ailments.map((a) => (
                      <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
