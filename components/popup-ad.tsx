"use client"

import { useEffect, useRef } from 'react'

export default function PopupAd() {
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Create and append the popup ad script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = '//countersuspiciousdiverse.com/a1/13/07/a113078fb08efadf0594c1e8d2e2a8d2.js'
    
    // Store reference for cleanup
    scriptRef.current = script
    
    // Append to document head
    document.head.appendChild(script)
    
    // Cleanup function
    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current)
      }
    }
  }, [])

  // This component doesn't render any visible content
  // The script handles the popup display
  return null
}
