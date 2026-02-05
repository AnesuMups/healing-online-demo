"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { getSalesReports, type SalesReport } from "@/lib/api"
import { BarChart3, TrendingUp, DollarSign, Users } from "lucide-react"

export default function ReportsPage() {
  const [reports, setReports] = useState<SalesReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSalesReports().then((data) => {
      setReports(data)
      setLoading(false)
    })
  }, [])

  const totalRevenue = reports.reduce((s, r) => s + r.revenue, 0)
  const totalSubs = reports.reduce((s, r) => s + r.subscriptions, 0)
  const avgRevenue = reports.length ? Math.round(totalRevenue / reports.length) : 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Sales & Subscription Reports</h1>
        <p className="mt-1 text-muted-foreground">Track revenue and subscription performance over time</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-border">
              <CardContent className="p-6">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card className="border border-border bg-background">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">${totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="border border-border bg-background">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Subscriptions</span>
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">{totalSubs}</div>
              </CardContent>
            </Card>
            <Card className="border border-border bg-background">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Monthly Revenue</span>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">${avgRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart (visual bar chart) */}
          <Card className="mb-8 border border-border bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3">
                {reports.map((r) => {
                  const maxRevenue = Math.max(...reports.map((rr) => rr.revenue))
                  const height = (r.revenue / maxRevenue) * 200
                  return (
                    <div key={r.month} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-xs font-medium text-foreground">${r.revenue}</span>
                      <div
                        className="w-full rounded-t-md bg-primary transition-all"
                        style={{ height: `${height}px` }}
                      />
                      <span className="text-xs text-muted-foreground">{r.month.split(" ")[0]}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border border-border bg-background">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Detailed Report</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Subscriptions</TableHead>
                    <TableHead>Avg per Sub</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r) => (
                    <TableRow key={r.month}>
                      <TableCell className="font-medium text-foreground">{r.month}</TableCell>
                      <TableCell className="text-muted-foreground">${r.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{r.subscriptions}</TableCell>
                      <TableCell className="text-muted-foreground">${Math.round(r.revenue / r.subscriptions)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
