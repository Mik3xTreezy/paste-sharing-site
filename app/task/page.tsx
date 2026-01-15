"use client"

import { useEffect } from 'react'

export default function TaskPage() {
  useEffect(() => {
    // Load the ad script
    const script = document.createElement('script')
    script.src = 'https://capriceawelessaweless.com/a1/13/07/a113078fb08efadf0594c1e8d2e2a8d2.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup: remove script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // Return empty content - no visible UI
  return null
}

