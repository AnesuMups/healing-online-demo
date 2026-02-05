"use client"

import React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useState } from "react"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Loader2, Heart } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("patient")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const success = await login(email, password, role)
      if (success) {
        router.push(role === "admin" ? "/admin" : "/dashboard")
      }
    } catch {
      setError("Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-20">
        <Card className="w-full max-w-md border border-border bg-background">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
            <p className="text-sm text-muted-foreground">Sign in to your Healing Online account</p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              <TabsContent value="patient">
                <p className="mt-2 text-xs text-muted-foreground">Log in to access your patient dashboard, medical records, and consultations.</p>
              </TabsContent>
              <TabsContent value="admin">
                <p className="mt-2 text-xs text-muted-foreground">Log in to manage patients, view reports, and administer the platform.</p>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="mt-1.5"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="mt-2 w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  `Sign in as ${role === "admin" ? "Admin" : "Patient"}`
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}
