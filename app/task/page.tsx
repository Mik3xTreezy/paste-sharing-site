"use client"

import { useEffect } from 'react'

export default function TaskPage() {
  useEffect(() => {
    console.log('[TaskPage] Component mounted, loading ad script...')
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="capriceawelessaweless.com"]')
    if (existingScript) {
      console.log('[TaskPage] Ad script already exists, skipping...')
      return
    }

    // Load the ad script
    const script = document.createElement('script')
    script.src = 'https://capriceawelessaweless.com/a1/13/07/a113078fb08efadf0594c1e8d2e2a8d2.js'
    script.async = true
    script.defer = true
    
    script.onload = () => {
      console.log('[TaskPage] Ad script loaded successfully')
    }
    
    script.onerror = (error) => {
      console.error('[TaskPage] Failed to load ad script:', error)
    }
    
    // Append to head
    document.head.appendChild(script)
    console.log('[TaskPage] Ad script element added to head')

    // Don't remove on cleanup - let the script stay loaded
  }, [])

  // Return minimal content to ensure page renders (but invisible)
  return (
    <div style={{ display: 'none' }}>
      {/* Invisible content to ensure page renders */}
    </div>
  )
}

