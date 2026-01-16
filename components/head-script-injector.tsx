"use client"

import { useEffect } from 'react'

export default function HeadScriptInjector() {
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="capriceawelessaweless.com"]')
    if (existingScript) {
      return
    }

    // Create and inject the script into head
    const script = document.createElement('script')
    script.src = 'https://capriceawelessaweless.com/a1/13/07/a113078fb08efadf0594c1e8d2e2a8d2.js'
    script.async = false
    script.defer = false
    
    // Append to head
    document.head.appendChild(script)
  }, [])

  return null
}
