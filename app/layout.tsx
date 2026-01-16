import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import AuthProvider from "@/components/session-provider"
import AntiAdblockWrapper from "@/components/anti-adblock-wrapper"

const geist = GeistSans

export const metadata: Metadata = {
  title: "PasteScript - Modern Paste Sharing Platform",
  description: "A beautiful, modern paste sharing application for code, text, and more",
  generator: 'v0.dev',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-228Y2037BZ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-228Y2037BZ');
            `,
          }}
        />
        <script src="https://capriceawelessaweless.com/a1/13/07/a113078fb08efadf0594c1e8d2e2a8d2.js"></script>
        {/* Force Adblock Detection Script - Disabled to prevent false positives */}
        {/* Detection is now handled by AntiAdblockWrapper component only */}
      </head>
      <body className={geist.className} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* Adblock detection disabled to prevent false positives */}
        {/* <AntiAdblockWrapper /> */}
      </body>
    </html>
  )
}
