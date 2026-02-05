"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Users, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary px-4 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl">About Healing Online</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              We are on a mission to make quality healthcare accessible to everyone, everywhere, through the power of technology.
            </p>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Healing Online was founded with a simple belief: everyone deserves access to quality healthcare regardless of their location or economic status. Our platform connects patients with qualified medical professionals who provide thorough consultations, accurate diagnoses, and personalized treatment plans.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                We have served over 2,000 patients across multiple regions, offering comprehensive care that ranges from general consultations to specialized treatments for chronic diseases, respiratory conditions, dermatological issues, and much more.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                To democratize healthcare by leveraging technology to bridge the gap between patients and medical professionals. We believe that distance, cost, and availability should never be barriers to receiving proper medical attention.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Our team of dedicated healthcare providers works tirelessly to ensure every patient receives the compassionate, thorough care they deserve. From initial consultation to ongoing treatment management, we are with you every step of the way.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-bold text-foreground">Our Values</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Heart className="h-6 w-6" />, title: "Compassion", desc: "Every patient interaction is guided by empathy and genuine care for wellbeing." },
                { icon: <Shield className="h-6 w-6" />, title: "Trust", desc: "We maintain the highest standards of medical ethics and data security." },
                { icon: <Users className="h-6 w-6" />, title: "Accessibility", desc: "Healthcare should be available to all, regardless of location or circumstance." },
                { icon: <Globe className="h-6 w-6" />, title: "Innovation", desc: "We continuously improve our platform to deliver better patient outcomes." },
              ].map((v) => (
                <Card key={v.title} className="border-none bg-background shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">{v.icon}</div>
                    <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-bold text-foreground">Meet Our Team</h2>
            <p className="mt-3 text-center text-muted-foreground">Dedicated professionals committed to your health</p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Dr. Sarah Mitchell", role: "Chief Medical Officer", bio: "20+ years in internal medicine and telemedicine." },
                { name: "Dr. James Okoro", role: "Lead Consultant", bio: "Specialist in chronic disease management and patient care." },
                { name: "Dr. Emily Chen", role: "Dermatology Lead", bio: "Expert in skin conditions, wound care, and dermatological treatments." },
              ].map((member) => (
                <Card key={member.name} className="border border-border bg-background">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-primary">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
