"use client"

import { useEffect, useRef } from 'react'

export default function CounterSuspiciousAd() {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let optionsScript: HTMLScriptElement | null = null
    let adScript: HTMLScriptElement | null = null
    
    // Wait a bit to ensure container is in DOM
    const timer = setTimeout(() => {
      if (adRef.current) {
        console.log('[CounterSuspiciousAd] Loading ad scripts...')
        
        // Check if scripts already exist
        const existingScript = document.querySelector('script[src*="6c540fce0bf72e4ddc067025b3f199cb"]')
        if (existingScript) {
          console.log('[CounterSuspiciousAd] Ad script already exists')
          return
        }
        
        // Create the script elements
        optionsScript = document.createElement('script')
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

        adScript = document.createElement('script')
        adScript.type = 'text/javascript'
        adScript.src = 'https://countersuspiciousdiverse.com/6c540fce0bf72e4ddc067025b3f199cb/invoke.js'
        adScript.async = true
        
        adScript.onload = () => {
          console.log('[CounterSuspiciousAd] Ad script loaded successfully')
          // Check if ad rendered
          setTimeout(() => {
            if (adRef.current) {
              const hasContent = adRef.current.querySelector('iframe') || adRef.current.innerHTML.trim().length > 0
              console.log('[CounterSuspiciousAd] Ad container has content:', hasContent)
              if (!hasContent) {
                console.warn('[CounterSuspiciousAd] Ad script loaded but no ad content rendered')
              }
            }
          }, 1000)
        }
        
        adScript.onerror = (error) => {
          console.error('[CounterSuspiciousAd] Failed to load ad script:', error)
        }

        // Append scripts to the ad container (like timer-ad does)
        // This ensures the container exists when the script runs
        adRef.current.appendChild(optionsScript)
        adRef.current.appendChild(adScript)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (adRef.current) {
        adRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="w-full flex justify-center py-2">
      <div 
        ref={adRef} 
        id="container-6c540fce0bf72e4ddc067025b3f199cb"
        className="ad-container"
        style={{ minHeight: '90px', minWidth: '728px', maxWidth: '100%' }}
      ></div>
    </div>
  )
} 