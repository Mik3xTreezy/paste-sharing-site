"use client"

import { useEffect, useRef } from 'react'

interface PopupAdProps {
  trigger?: boolean
  onTriggered?: () => void
}

export default function PopupAd({ trigger = false, onTriggered }: PopupAdProps) {
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (trigger && !scriptLoadedRef.current) {
      // Load the popup ad script
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = '//countersuspiciousdiverse.com/a1/13/07/a113078fb08efadf0594c1e8d2e2a8d2.js'
      script.async = true
      script.onload = () => {
        console.log('Popup ad script loaded successfully')
        scriptLoadedRef.current = true
        onTriggered?.()
      }
      script.onerror = () => {
        console.error('Failed to load popup ad script')
        onTriggered?.()
      }
      document.head.appendChild(script)
    }
  }, [trigger, onTriggered])

  // Component doesn't render anything visible
  return null
}
