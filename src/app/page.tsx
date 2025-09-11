import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Star, Users, Zap, Shield, BarChart3 } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "SaaSKit - Modern SaaS Starter Kit | Build Your SaaS Faster",
  description: "Launch your SaaS application faster with our modern starter kit. Includes authentication, billing, dashboard, analytics, and more. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: ["SaaS", "starter kit", "Next.js", "TypeScript", "Tailwind CSS", "authentication", "billing", "dashboard", "analytics"],
  authors: [{ name: "SaaSKit Team" }],
  creator: "SaaSKit",
  publisher: "SaaSKit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saaskit.dev",
    title: "SaaSKit - Modern SaaS Starter Kit",
    description: "Everything you need to launch your SaaS application. Authentication, billing, dashboard, and more - all built with modern technologies and best practices.",
    siteName: "SaaSKit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaaSKit - Modern SaaS Starter Kit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSKit - Modern SaaS Starter Kit",
    description: "Launch your SaaS application faster with our modern starter kit. Built with Next.js, TypeScript, and Tailwind CSS.",
    images: ["/og-image.png"],
    creator: "@saaskit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-foreground">SaaSKit</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium"
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium"
                  >
                    Pricing
                  </a>
                  <a
                    href="#about"
                    className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium"
                  >
                    About
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              New: Advanced Analytics Dashboard
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
              Build your SaaS faster with our <span className="text-primary">modern starter kit</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty">
              Everything you need to launch your SaaS application. Authentication, billing, dashboard, and more - all
              built with modern technologies and best practices.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Start Building <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Built with the latest technologies and best practices</p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>Built with Next.js 14 and optimized for performance</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Secure by Default</CardTitle>
                <CardDescription>Enterprise-grade security with authentication and authorization</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Analytics Ready</CardTitle>
                <CardDescription>Built-in analytics dashboard with beautiful charts and insights</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Complete user management system with roles and permissions</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>Tested, documented, and ready for production deployment</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Modern UI</CardTitle>
                <CardDescription>Beautiful, responsive design with dark mode support</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-2xl px-6 py-16 sm:p-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to build your SaaS?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join thousands of developers who trust our starter kit
              </p>
              <div className="mt-8">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Get Started Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">SaaSKit</h3>
            <p className="mt-2 text-sm text-muted-foreground">Built with Next.js, Tailwind CSS, and shadcn/ui</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
