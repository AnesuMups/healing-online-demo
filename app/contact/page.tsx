"use client"

import React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { submitContactForm } from "@/lib/api"
import { Mail, Phone, MapPin, CheckCircle2, Loader2 } from "lucide-react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await submitContactForm(form)
      setSuccess(true)
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary px-4 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl">Contact Us</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
            </p>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
              <p className="mt-3 text-muted-foreground">
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              <div className="mt-8 flex flex-col gap-6">
                {[
                  { icon: <Mail className="h-5 w-5" />, label: "Email", value: "support@healingonline.com" },
                  { icon: <Phone className="h-5 w-5" />, label: "Phone", value: "+1 (555) 123-4567" },
                  { icon: <MapPin className="h-5 w-5" />, label: "Office", value: "123 Health Street, Medical District" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border border-border bg-background">
              <CardContent className="p-6">
                {success ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Message Sent!</h3>
                    <p className="mt-2 text-muted-foreground">We will get back to you within 24 hours.</p>
                    <Button className="mt-6" onClick={() => setSuccess(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="What is this about?"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        required
                        rows={5}
                        className="mt-1.5"
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" disabled={loading} className="mt-2">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
