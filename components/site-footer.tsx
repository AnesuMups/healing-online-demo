import Link from "next/link"
import { Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Global Healer Online</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Professional healthcare consultations from the comfort of your home. Affordable, accessible, and compassionate care for everyone.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Platform</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link>
              <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground">Services</Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Support</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Patient Login</Link>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Admin Login</Link>
              <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground">Register</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>support@Global Healeronline.com</p>
              <p>+1 (555) 123-4567</p>
              <p>Mon - Fri, 8am - 6pm</p>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {"2026 Global Healer Online. All rights reserved."}
        </div>
      </div>
    </footer>
  )
}
