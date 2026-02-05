"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getMessages, sendMessage, type Message } from "@/lib/api"
import {
  MessageSquare,
  Send,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  Mail,
  Phone,
} from "lucide-react"

export default function PatientMessagesPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [content, setContent] = useState("")
  const [toast, setToast] = useState("")

  useEffect(() => {
    if (user) {
      getMessages(user.id).then((data) => {
        setMessages(data)
        setLoading(false)
      })
    }
  }, [user])

  async function handleSend() {
    if (!user || !content.trim()) return
    setSending(true)
    try {
      await sendMessage(user.id, "email", content)
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        patientId: user.id,
        patientName: user.name,
        channel: "email",
        content,
        sentAt: new Date().toISOString(),
        direction: "inbound",
      }
      setMessages((prev) => [newMsg, ...prev])
      setContent("")
      setToast("Message sent to your care team")
      setTimeout(() => setToast(""), 3000)
    } catch {
      setToast("Failed to send message")
      setTimeout(() => setToast(""), 3000)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="mt-1 text-muted-foreground">
          Communicate with your care team via email and WhatsApp
        </p>
      </div>

      {toast && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-secondary p-3">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">{toast}</span>
        </div>
      )}

      {/* Compose */}
      <Card className="mb-6 border border-border bg-background">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Send className="h-5 w-5 text-primary" />
            Send a Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message to your care team..."
            rows={3}
          />
          <Button
            onClick={handleSend}
            disabled={sending || !content.trim()}
            className="mt-3 gap-2"
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

      {/* Message History */}
      <Card className="border border-border bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Message History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">No Messages Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Send a message to start communicating with your care team.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-lg border p-4 ${
                    msg.direction === "inbound"
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          msg.direction === "outbound"
                            ? "bg-primary/10 text-primary"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {msg.direction === "outbound" ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {msg.direction === "outbound" ? "Care Team" : "You"}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              msg.channel === "whatsapp"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-blue-200 bg-blue-50 text-blue-700"
                            }
                          >
                            {msg.channel === "whatsapp" ? (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" /> WhatsApp
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" /> Email
                              </span>
                            )}
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
  )
}
