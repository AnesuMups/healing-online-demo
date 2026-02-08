"use client"

import React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { getMembershipPlans, processPayment, type MembershipPlan } from "@/lib/api"
import { Loader2, Heart, Check, CreditCard, CheckCircle2, XCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Step = "account" | "plan" | "payment" | "success"

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("account")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentError, setPaymentError] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const { register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    getMembershipPlans().then(setPlans)
    const planParam = searchParams.get("plan")
    if (planParam) setSelectedPlan(planParam)
  }, [searchParams])

  function formatCardNumber(value: string) {
    const v = value.replace(/\s/g, "").replace(/\D/g, "").slice(0, 16)
    return v.replace(/(.{4})/g, "$1 ").trim()
  }

  function formatExpiry(value: string) {
    const v = value.replace(/\D/g, "").slice(0, 4)
    if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`
    return v
  }

  async function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setError("")
    setLoading(true)
    try {
      await register(name, email, password, "patient")
      setStep("plan")
    } catch {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handlePlanSelect() {
    if (!selectedPlan) {
      setError("Please select a plan")
      return
    }
    setError("")
    setStep("payment")
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setPaymentError(false)
    try {
      const result = await processPayment(cardNumber.replace(/\s/g, ""), expiry, cvv, selectedPlan)
      setTransactionId(result.transactionId)
      setStep("success")
    } catch (err: unknown) {
      setPaymentError(true)
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-20">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {(["account", "plan", "payment", "success"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    step === s
                      ? "bg-primary text-primary-foreground"
                      : (["account", "plan", "payment", "success"].indexOf(step) > i)
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {["account", "plan", "payment", "success"].indexOf(step) > i ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 3 && <div className={`h-px w-8 ${["account", "plan", "payment", "success"].indexOf(step) > i ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Account */}
          {step === "account" && (
            <Card className="border border-border bg-background">
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl text-foreground">Create Your Account</CardTitle>
                <p className="text-sm text-muted-foreground">Join Global Healer Online today</p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form onSubmit={handleAccountSubmit} className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" required className="mt-1.5" />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" disabled={loading} className="mt-2 w-full gap-2">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : <>Continue <ArrowRight className="h-4 w-4" /></>}
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Plan Selection */}
          {step === "plan" && (
            <Card className="border border-border bg-background">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">Choose Your Plan</CardTitle>
                <p className="text-sm text-muted-foreground">Select a membership that works for you</p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="flex flex-col gap-4">
                  {plans.map((plan) => (
                    <label
                      key={plan.id}
                      htmlFor={plan.id}
                      className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                        selectedPlan === plan.id ? "border-primary bg-secondary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{plan.name}</span>
                              {plan.recommended && <Badge className="bg-primary text-primary-foreground">Best Value</Badge>}
                            </div>
                            <div className="mt-1">
                              <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                              <span className="text-sm text-muted-foreground">/{plan.period}</span>
                            </div>
                            <ul className="mt-3 flex flex-col gap-1.5">
                              {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Check className="h-3 w-3 shrink-0 text-primary" />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
                {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={() => setStep("account")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handlePlanSelect} className="flex-1 gap-2">
                    Continue to Payment <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <Card className="border border-border bg-background">
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <CreditCard className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl text-foreground">Payment Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedPlanData ? `${selectedPlanData.name} Plan - $${selectedPlanData.price}/${selectedPlanData.period}` : "Complete your payment"}
                </p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {paymentError && (
                  <div className="mb-4 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                    <div>
                      <p className="text-sm font-medium text-destructive">Payment Failed</p>
                      <p className="text-xs text-muted-foreground">{error}</p>
                    </div>
                  </div>
                )}
                <form onSubmit={handlePayment} className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="card-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        required
                        maxLength={19}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="flex h-6 items-center rounded bg-foreground/10 px-1.5 text-xs font-bold text-foreground">MC</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" required maxLength={5} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" required maxLength={4} className="mt-1.5" />
                    </div>
                  </div>
                  <div className="mt-2 rounded-lg bg-muted p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Plan</span>
                      <span className="font-medium text-foreground">{selectedPlanData?.name}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-bold text-foreground">${selectedPlanData?.price}.00</span>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-3">
                    <Button type="button" variant="outline" onClick={() => { setStep("plan"); setPaymentError(false); setError("") }} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 gap-2">
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : <>Pay ${selectedPlanData?.price}.00</>}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <Card className="border border-border bg-background">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Welcome to Global Healer Online!</h2>
                <p className="mt-2 text-muted-foreground">
                  Your account has been created and payment was successful.
                </p>
                <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
                  <div className="flex justify-between gap-8">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium text-foreground">{selectedPlanData?.name}</span>
                  </div>
                  <div className="mt-1 flex justify-between gap-8">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium text-foreground">${selectedPlanData?.price}.00</span>
                  </div>
                  <div className="mt-1 flex justify-between gap-8">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-xs text-foreground">{transactionId}</span>
                  </div>
                </div>
                <Button className="mt-6 w-full gap-2" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
