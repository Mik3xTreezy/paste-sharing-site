"use client"

import { useEffect, useRef } from 'react'

export default function CounterSuspiciousAd() {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (adRef.current) {
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
      adScript.src = '//countersuspiciousdiverse.com/6c540fce0bf72e4ddc067025b3f199cb/invoke.js'

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
    <div className="w-full flex justify-center">
      <div ref={adRef} className="ad-container"></div>
    </div>
  )
} 