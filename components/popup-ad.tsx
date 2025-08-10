"use client"

import { useEffect, useRef } from 'react'

export default function PopupAd() {
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Create and append the popup ad script
    const script = document.createElement('script')
    script.setAttribute('data-cfasync', 'false')
    script.src = '//d1pk6uu6wqrpce.cloudfront.net/?uukpd=1206335'
    
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
