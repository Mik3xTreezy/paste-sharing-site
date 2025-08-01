import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import AuthProvider from "@/components/session-provider"

const geist = GeistSans

export const metadata: Metadata = {
  title: "PasteShare - Modern Paste Sharing Platform",
  description: "A beautiful, modern paste sharing application for code, text, and more",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={geist.className} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
