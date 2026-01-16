"use client"

import { useEffect, useRef } from 'react'

export default function CounterSuspiciousAd() {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (adRef.current) {
      console.log('[CounterSuspiciousAd] Loading ad scripts...')
      
      // Clear any existing content
      adRef.current.innerHTML = ''
      
      // Create the script elements
      const optionsScript = document.createElement('script')
      optionsScript.type = 'text/javascript'
      optionsScript.innerHTML = `
        atOptions = {
            'key' : '6c540fce0bf72e4ddc067025b3f199cb',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
        };
      `

      const adScript = document.createElement('script')
      adScript.type = 'text/javascript'
      adScript.src = 'https://countersuspiciousdiverse.com/6c540fce0bf72e4ddc067025b3f199cb/invoke.js'
      adScript.async = true
      
      adScript.onload = () => {
        console.log('[CounterSuspiciousAd] Ad script loaded successfully')
      }
      
      adScript.onerror = (error) => {
        console.error('[CounterSuspiciousAd] Failed to load ad script:', error)
      }

      // Append scripts to the ad container
      adRef.current.appendChild(optionsScript)
      adRef.current.appendChild(adScript)

      // Cleanup function
      return () => {
        if (adRef.current) {
          adRef.current.innerHTML = ''
        }
      }
    }
  }, [])

  return (
    <div className="w-full flex justify-center py-2">
      <div 
        ref={adRef} 
        className="ad-container"
        style={{ minHeight: '90px', minWidth: '728px', maxWidth: '100%' }}
      ></div>
    </div>
  )
} 