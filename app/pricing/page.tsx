"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getMembershipPlans, type MembershipPlan } from "@/lib/api"
import { Check, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function PricingPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMembershipPlans().then((data) => {
      setPlans(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary px-4 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl">Simple, Transparent Pricing</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Choose the plan that works for you. No hidden fees, no surprises.
            </p>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-4xl">
            {loading ? (
              <div className="grid gap-8 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <Card key={i} className="border border-border">
                    <CardContent className="p-8">
                      <Skeleton className="mb-4 h-6 w-24" />
                      <Skeleton className="mb-6 h-12 w-32" />
                      {Array.from({ length: 4 }).map((_, j) => (
                        <Skeleton key={j} className="mb-2 h-4 w-full" />
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative border bg-background transition-shadow hover:shadow-lg ${
                      plan.recommended ? "border-primary ring-2 ring-primary" : "border-border"
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2 pt-8">
                      <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                        <span className="text-muted-foreground">/{plan.period}</span>
                      </div>
                      <ul className="mb-8 flex flex-col gap-3">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span className="text-sm text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full gap-2" variant={plan.recommended ? "default" : "outline"} asChild>
                        <Link href={`/register?plan=${plan.id}`}>
                          Choose {plan.name} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-16">
              <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. There are no long-term commitments." },
                  { q: "What payment methods do you accept?", a: "We accept Mastercard and other major credit/debit cards." },
                  { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption to protect all patient data and medical records." },
                  { q: "Can I switch plans?", a: "Yes, you can upgrade or downgrade your plan at any time from your dashboard." },
                ].map((faq) => (
                  <Card key={faq.q} className="border border-border bg-background">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-foreground">{faq.q}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
