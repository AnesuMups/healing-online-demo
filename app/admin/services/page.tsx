"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { getHealthCategories, type HealthCategory } from "@/lib/api"
import { Plus, Pencil, Trash2, Loader2, CheckCircle2 } from "lucide-react"

export default function AdminServicesPage() {
  const [services, setServices] = useState<HealthCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<HealthCategory | null>(null)
  const [formName, setFormName] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")

  useEffect(() => {
    getHealthCategories().then((data) => {
      setServices(data)
      setLoading(false)
    })
  }, [])

  function openAdd() {
    setEditingService(null)
    setFormName("")
    setFormDesc("")
    setDialogOpen(true)
  }

  function openEdit(service: HealthCategory) {
    setEditingService(service)
    setFormName(service.name)
    setFormDesc(service.description)
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? { ...s, name: formName, description: formDesc } : s))
      )
      showToast("Service updated successfully")
    } else {
      const newService: HealthCategory = {
        id: String(Date.now()),
        name: formName,
        description: formDesc,
        icon: "activity",
      }
      setServices((prev) => [...prev, newService])
      showToast("Service added successfully")
    }
    setSaving(false)
    setDialogOpen(false)
  }

  function handleDelete(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id))
    showToast("Service deleted successfully")
  }

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(""), 3000)
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Services</h1>
          <p className="mt-1 text-muted-foreground">Add, edit, and delete health service categories</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      {toast && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-secondary p-3">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">{toast}</span>
        </div>
      )}

      <Card className="border border-border bg-background">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium text-foreground">{service.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{service.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(service)} className="gap-1.5">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)} className="gap-1.5 text-destructive hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-foreground">{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="svc-name">Service Name</Label>
              <Input id="svc-name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Service name" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="svc-desc">Description</Label>
              <Textarea id="svc-desc" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Describe the service..." rows={3} className="mt-1.5" />
            </div>
            <Button onClick={handleSave} disabled={saving || !formName.trim()} className="gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : editingService ? "Update Service" : "Add Service"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
