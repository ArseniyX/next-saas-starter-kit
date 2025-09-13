import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "SaaSKit - Modern SaaS Starter Kit",
        template: "%s | SaaSKit",
    },
    description:
        "Launch your SaaS application faster with our modern starter kit. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.",
    generator: "Next.js",
    applicationName: "SaaSKit",
    referrer: "origin-when-cross-origin",
    category: "technology",
    classification: "SaaS Development Tools",
    metadataBase: new URL("https://saaskit.dev"),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
            >
                <Suspense fallback={null}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <AuthProvider>
                            {children}
                            <Toaster />
                        </AuthProvider>
                    </ThemeProvider>
                </Suspense>
                <Analytics />
            </body>
        </html>
    );
}
