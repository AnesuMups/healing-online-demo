import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, DM_Sans } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })

export const metadata: Metadata = {
  title: "Healing Online - Your Healthcare, Reimagined",
  description:
    "Professional healthcare consultations from the comfort of your home. Affordable membership plans, expert medical advice, and comprehensive care.",
}

export const viewport: Viewport = {
  themeColor: "#0f9c7a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
