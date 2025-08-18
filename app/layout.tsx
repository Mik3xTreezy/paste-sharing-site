import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import AuthProvider from "@/components/session-provider"
import AntiAdblockAdvanced from "@/components/anti-adblock-advanced"

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
      </head>
      <body className={geist.className} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <AntiAdblockAdvanced 
          onAdblockDetected={() => {
            console.log('Ad blocker detected - user experience may be affected')
          }}
          onAdblockNotDetected={() => {
            console.log('No ad blocker detected - full functionality available')
          }}
          showWarning={true}
          customWarningMessage="We've detected that you're using an ad blocker. Our paste sharing service relies on advertising to remain free and accessible to everyone. Please disable your ad blocker for this site to continue using our services."
        />
      </body>
    </html>
  )
}
