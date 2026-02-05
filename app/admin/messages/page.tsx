"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import {
  getMessages,
  getAllPatients,
  sendMessage,
  type Message,
  type PatientRecord,
} from "@/lib/api"
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  Mail,
  Phone,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState("")
  const [channel, setChannel] = useState<"whatsapp" | "email">("email")
  const [content, setContent] = useState("")
  const [toast, setToast] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    Promise.all([getMessages(), getAllPatients()]).then(([msgs, pts]) => {
      setMessages(msgs)
      setPatients(pts)
      setLoading(false)
    })
  }, [])

  async function handleSend() {
    if (!selectedPatient || !content.trim()) return
    setSending(true)
    try {
      await sendMessage(selectedPatient, channel, content)
      const patient = patients.find((p) => p.patientId === selectedPatient)
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        patientId: selectedPatient,
        patientName: patient?.patientName || "Unknown",
        channel,
        content,
        sentAt: new Date().toISOString(),
        direction: "outbound",
      }
      setMessages((prev) => [newMsg, ...prev])
      setContent("")
      setToast("Message sent successfully")
      setTimeout(() => setToast(""), 3000)
    } catch {
      setToast("Failed to send message")
      setTimeout(() => setToast(""), 3000)
    } finally {
      setSending(false)
    }
  }

  const filteredMessages = messages.filter(
    (m) =>
      m.patientName.toLowerCase().includes(search.toLowerCase()) ||
      m.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Communication Center</h1>
        <p className="mt-1 text-muted-foreground">
          Send and manage messages to patients via WhatsApp and email
        </p>
      </div>

      {toast && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-secondary p-3">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">{toast}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Compose Panel */}
        <Card className="border border-border bg-background lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5 text-primary" />
              New Message
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="patient-select">Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger id="patient-select" className="mt-1.5">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.patientId} value={p.patientId}>
                      {p.patientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Channel</Label>
              <div className="mt-1.5 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={channel === "email" ? "default" : "outline"}
                  onClick={() => setChannel("email")}
                  className={`gap-2 ${channel !== "email" ? "bg-transparent" : ""}`}
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={channel === "whatsapp" ? "default" : "outline"}
                  onClick={() => setChannel("whatsapp")}
                  className={`gap-2 ${channel !== "whatsapp" ? "bg-transparent" : ""}`}
                >
                  <Phone className="h-3.5 w-3.5" /> WhatsApp
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="msg-content">Message</Label>
              <Textarea
                id="msg-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message..."
                rows={4}
                className="mt-1.5"
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={sending || !selectedPatient || !content.trim()}
              className="gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Messages List */}
        <Card className="border border-border bg-background lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                Message History
              </CardTitle>
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages..."
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">No Messages</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send your first message to a patient using the compose panel.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            msg.direction === "outbound"
                              ? "bg-primary/10 text-primary"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {msg.direction === "outbound" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {msg.patientName}
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                msg.channel === "whatsapp"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-blue-200 bg-blue-50 text-blue-700"
                              }
                            >
                              {msg.channel === "whatsapp" ? "WhatsApp" : "Email"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                msg.direction === "outbound"
                                  ? "border-primary/20 bg-primary/5 text-primary"
                                  : "border-blue-200 bg-blue-50 text-blue-700"
                              }
                            >
                              {msg.direction === "outbound" ? "Sent" : "Received"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{msg.content}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(msg.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
