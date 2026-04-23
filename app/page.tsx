"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Stethoscope, ShieldCheck, Users, ArrowRight, Heart, Clock, Phone } from "lucide-react"

export default function HomePage() {
  const [isHovered, setIsHovered] = useState<string | null>(null)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Digital Savers</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/patient">
              <Button variant="outline" size="sm">Patient</Button>
            </Link>
            <Link href="/nurse">
              <Button variant="outline" size="sm">Nurse</Button>
            </Link>
            <Link href="/admin">
              <Button size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent via-background to-background" />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Voice-First Healthcare at Your Fingertips
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
              Bol kar apni pareshani batayein. Our AI-powered platform connects you with verified nurses instantly through voice commands.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/patient">
                <Button size="lg" className="gap-2">
                  <Mic className="h-5 w-5" />
                  Get Started as Patient
                </Button>
              </Link>
              <Link href="/nurse">
                <Button size="lg" variant="outline" className="gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Join as Nurse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Why Choose Digital Savers?</h2>
            <p className="mt-4 text-muted-foreground">
              Revolutionary healthcare platform designed for accessibility and trust
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Mic,
                title: "Voice-First Interface",
                description: "Simply speak your symptoms in any language. Our AI understands and responds instantly.",
                id: "voice"
              },
              {
                icon: ShieldCheck,
                title: "AI-Verified Nurses",
                description: "Every nurse passes rigorous AI medical assessments and video interviews before joining.",
                id: "verified"
              },
              {
                icon: Clock,
                title: "Smart Triage System",
                description: "AI analyzes symptoms and provides instant risk assessment - High, Medium, or Low priority.",
                id: "triage"
              },
              {
                icon: Users,
                title: "Perfect Matching",
                description: "Our AI matches your needs with the most qualified and available nurse in your area.",
                id: "matching"
              },
              {
                icon: Phone,
                title: "SOS Emergency",
                description: "One-tap emergency button for instant ambulance dispatch and family alerts.",
                id: "sos"
              },
              {
                icon: Heart,
                title: "Long-term Care",
                description: "Book nurses for extended care with transparent tracking of the hiring process.",
                id: "care"
              }
            ].map((feature) => (
              <Card 
                key={feature.id}
                className={`transition-all duration-300 cursor-pointer ${isHovered === feature.id ? 'shadow-lg -translate-y-1 border-primary/50' : ''}`}
                onMouseEnter={() => setIsHovered(feature.id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">How It Works</h2>
            <p className="mt-4 text-muted-foreground">
              Simple steps to get the care you need
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Speak Your Symptoms",
                description: "Tap the microphone and describe how you feel in your preferred language."
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our AI analyzes your symptoms, creates a triage report, and matches you with nurses."
              },
              {
                step: "03",
                title: "Get Care",
                description: "Choose immediate help or long-term care. Track your nurse assignment in real-time."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="absolute right-0 top-8 hidden -translate-x-1/2 md:block">
                    <ArrowRight className="h-6 w-6 text-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Join thousands of patients and nurses already using Digital Savers
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/patient">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Mic className="h-5 w-5" />
                  Start as Patient
                </Button>
              </Link>
              <Link href="/nurse/register">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  Register as Nurse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">Digital Savers</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Voice-first healthcare platform connecting patients with verified nurses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">For Patients</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/patient" className="hover:text-primary">Patient Dashboard</Link></li>
                <li><Link href="/patient" className="hover:text-primary">Book a Nurse</Link></li>
                <li><Link href="/patient" className="hover:text-primary">Emergency SOS</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">For Nurses</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/nurse/register" className="hover:text-primary">Join Our Team</Link></li>
                <li><Link href="/nurse" className="hover:text-primary">Nurse Portal</Link></li>
                <li><Link href="/nurse" className="hover:text-primary">Verification Process</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Contact</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>support@digitalsavers.com</li>
                <li>+91 1800-XXX-XXXX</li>
                <li>24/7 Emergency Support</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Digital Savers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
