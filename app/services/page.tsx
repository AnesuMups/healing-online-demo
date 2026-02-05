"use client"

import React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getHealthCategories, type HealthCategory } from "@/lib/api"
import { Stethoscope, HeartPulse, Wind, Shield, Zap, Baby, Activity, AlertTriangle, ArrowRight, DeleteIcon as SkeletonIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const iconMap: Record<string, React.ReactNode> = {
  stethoscope: <Stethoscope className="h-7 w-7" />,
  "heart-pulse": <HeartPulse className="h-7 w-7" />,
  wind: <Wind className="h-7 w-7" />,
  shield: <Shield className="h-7 w-7" />,
  zap: <Zap className="h-7 w-7" />,
  baby: <Baby className="h-7 w-7" />,
  activity: <Activity className="h-7 w-7" />,
  "alert-triangle": <AlertTriangle className="h-7 w-7" />,
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<HealthCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHealthCategories().then((data) => {
      setCategories(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary px-4 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl">Our Services</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Comprehensive health categories covering everything from general consultations to specialized care.
            </p>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border border-border">
                    <CardContent className="p-6">
                      <Skeleton className="mb-4 h-12 w-12 rounded-lg" />
                      <Skeleton className="mb-2 h-5 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="mt-1 h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                  <Card key={cat.id} className="border border-border bg-background transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
                        {iconMap[cat.icon] || <Activity className="h-7 w-7" />}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{cat.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cat.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground">Need a Consultation?</h2>
            <p className="mt-4 text-muted-foreground">
              Register today and fill out your medical intake form to get started with a comprehensive health assessment.
            </p>
            <Button size="lg" className="mt-8 gap-2" asChild>
              <Link href="/register">
                Get Started Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
