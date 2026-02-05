"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Search, Eye, FileText, Download } from "lucide-react"

export default function AdminRecordsPage() {
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<PatientRecord | null>(null)

  useEffect(() => {
    getAllPatients().then((data) => {
      setRecords(data)
      setLoading(false)
    })
  }, [])

  const filtered = records.filter(
    (r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.ailments.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  )

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-primary/10 text-primary border-primary/20",
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medical Records</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all submitted medical intake records
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="border border-border bg-background">
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Total Records</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{records.length}</div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-background">
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Pending Review</div>
            <div className="mt-1 text-2xl font-bold text-amber-600">
              {records.filter((r) => r.consultationStatus === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-background">
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="mt-1 text-2xl font-bold text-primary">
              {records.filter((r) => r.consultationStatus === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border bg-background">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-3 h-12 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Ailments</TableHead>
                    <TableHead>Chronic</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {rec.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{rec.patientName}</div>
                        <div className="text-xs text-muted-foreground">
                          {rec.gender}, {rec.age} yrs
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{rec.submittedAt}</TableCell>
                      <TableCell>
                        <div className="flex max-w-[200px] flex-wrap gap-1">
                          {rec.ailments.slice(0, 2).map((a) => (
                            <Badge key={a} variant="outline" className="text-xs">
                              {a.length > 20 ? `${a.slice(0, 20)}...` : a}
                            </Badge>
                          ))}
                          {rec.ailments.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{rec.ailments.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            rec.chronicCondition
                              ? "border-destructive/20 bg-destructive/10 text-destructive"
                              : "border-primary/20 bg-primary/10 text-primary"
                          }
                        >
                          {rec.chronicCondition ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColors[rec.consultationStatus] || ""}
                        >
                          {rec.consultationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelected(rec)}
                          className="gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        No records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  Record {selected.id}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Patient:</span>{" "}
                    <span className="font-medium text-foreground">{selected.patientName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="text-foreground">{selected.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>{" "}
                    <span className="text-foreground">{selected.gender}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>{" "}
                    <span className="text-foreground">{selected.age}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Plan:</span>{" "}
                    <span className="text-foreground">{selected.membershipPlan}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>{" "}
                    <span className="text-foreground">{selected.submittedAt}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Medical History</h4>
                  <p className="text-sm text-muted-foreground">{selected.medicalHistory}</p>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">
                    Current Condition & Treatment
                  </h4>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <p>
                      <span className="text-muted-foreground">Chronic:</span>{" "}
                      <span className="text-foreground">
                        {selected.chronicCondition ? "Yes" : "No"}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Cause:</span>{" "}
                      <span className="text-foreground">{selected.causeOfInfection || "N/A"}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Condition:</span>{" "}
                      <span className="text-foreground">{selected.currentCondition}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Other treatments:</span>{" "}
                      <span className="text-foreground">
                        {selected.otherTreatments || "None"}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Ailments</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.ailments.map((a) => (
                      <Badge key={a} variant="outline" className="text-xs">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <Badge
                    variant="outline"
                    className={statusColors[selected.consultationStatus] || ""}
                  >
                    Consultation: {selected.consultationStatus}
                  </Badge>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-3.5 w-3.5" /> Export PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
