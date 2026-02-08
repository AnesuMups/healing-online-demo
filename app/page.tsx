"use client"

import React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getHealthCategories, getTestimonials, type HealthCategory, type Testimonial } from "@/lib/api"
import {
  Heart,
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Wind,
  Zap,
  Baby,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  stethoscope: <Stethoscope className="h-6 w-6" />,
  "heart-pulse": <HeartPulse className="h-6 w-6" />,
  wind: <Wind className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  baby: <Baby className="h-6 w-6" />,
  activity: <Activity className="h-6 w-6" />,
  "alert-triangle": <AlertTriangle className="h-6 w-6" />,
}

export default function HomePage() {
  const [categories, setCategories] = useState<HealthCategory[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    getHealthCategories().then(setCategories)
    getTestimonials().then(setTestimonials)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary px-4 py-24 lg:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-background" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-background" />
          </div>
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground">
              <Heart className="h-4 w-4" />
              <span>Trusted by 2,000+ patients</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Your Healthcare, Reimagined for the Modern World
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
              Access professional medical consultations from the comfort of your home. Affordable plans, expert doctors, and comprehensive care tailored to your needs.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="gap-2 text-base" asChild>
                <Link href="/register">
                  Start Your Journey <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-background px-4 py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: "2,000+", label: "Patients Served", icon: <Users className="h-5 w-5 text-primary" /> },
              { value: "98%", label: "Satisfaction Rate", icon: <Star className="h-5 w-5 text-primary" /> },
              { value: "24/7", label: "Available Support", icon: <Clock className="h-5 w-5 text-primary" /> },
              { value: "50+", label: "Health Categories", icon: <Shield className="h-5 w-5 text-primary" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground">How Global Healer Online Works</h2>
              <p className="mt-3 text-muted-foreground">Get started in three simple steps</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { step: "01", title: "Create Your Account", desc: "Sign up and choose a membership plan that fits your needs. Individual or Family options available." },
                { step: "02", title: "Complete Your Intake", desc: "Fill out your medical history and current ailments through our comprehensive intake form." },
                { step: "03", title: "Get Expert Care", desc: "Receive professional consultation, treatment plans, and ongoing support from our medical team." },
              ].map((item) => (
                <Card key={item.step} className="relative border-none bg-background shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground">Our Health Categories</h2>
              <p className="mt-3 text-muted-foreground">Comprehensive care across all major health areas</p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 8).map((cat) => (
                <Card key={cat.id} className="border border-border bg-background transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      {iconMap[cat.icon] || <Activity className="h-6 w-6" />}
                    </div>
                    <h3 className="font-semibold text-foreground">{cat.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-balance text-3xl font-bold text-foreground">Why Patients Choose Global Healer Online</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  We combine modern technology with compassionate care to deliver healthcare that is accessible, affordable, and effective.
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  {[
                    "Qualified medical professionals with years of experience",
                    "Secure and confidential health records management",
                    "Affordable membership plans for individuals and families",
                    "Comprehensive intake process for accurate diagnosis",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <Button className="mt-8 gap-2" asChild>
                  <Link href="/about">
                    Learn More About Us <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary p-6">
                  <div className="text-3xl font-bold text-primary-foreground">$10</div>
                  <div className="mt-1 text-sm text-primary-foreground/80">Individual plan / month</div>
                </Card>
                <Card className="bg-foreground p-6">
                  <div className="text-3xl font-bold text-background">$30</div>
                  <div className="mt-1 text-sm text-background/80">Family plan / month</div>
                </Card>
                <Card className="col-span-2 border border-border bg-background p-6">
                  <div className="text-2xl font-bold text-foreground">100%</div>
                  <div className="mt-1 text-sm text-muted-foreground">Commitment to your health and wellbeing</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground">What Our Patients Say</h2>
              <p className="mt-3 text-muted-foreground">Real stories from real patients</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.id} className="border border-border bg-background">
                  <CardContent className="p-6">
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{`"${t.text}"`}</p>
                    <div className="mt-4 text-sm font-semibold text-foreground">{t.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold text-primary-foreground">Ready to Take Control of Your Health?</h2>
            <p className="mt-4 text-primary-foreground/80">
              Join thousands of patients who trust Global Healer Online for their healthcare needs. Start with a free consultation today.
            </p>
            <Button size="lg" variant="secondary" className="mt-8 gap-2 text-base" asChild>
              <Link href="/register">
                Create Your Account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
