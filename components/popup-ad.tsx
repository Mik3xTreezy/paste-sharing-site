"use client"

import { useEffect, useRef } from 'react'

interface PopupAdProps {
  trigger?: boolean
  onTriggered?: () => void
}

export default function PopupAd({ trigger = false, onTriggered }: PopupAdProps) {
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    console.log('PopupAd: trigger changed to', trigger)
    
    if (trigger && !scriptLoadedRef.current) {
      console.log('PopupAd: Loading popup script...')
      
      // Load the popup ad script directly
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = '//countersuspiciousdiverse.com/a1/13/07/a113078fb08efadf0594c1e8d2e2a8d2.js'
      script.async = true
      
      script.onload = () => {
        console.log('PopupAd: Script loaded successfully')
        scriptLoadedRef.current = true
        onTriggered?.()
      }
      
      script.onerror = () => {
        console.error('PopupAd: Failed to load script')
        onTriggered?.()
      }
      
      document.head.appendChild(script)
    } else if (trigger && scriptLoadedRef.current) {
      console.log('PopupAd: Script already loaded, calling onTriggered')
      onTriggered?.()
    }
  }, [trigger, onTriggered])

  // Component doesn't render anything visible
  return null
}
