"use client"

import { useEffect, useRef } from 'react'

export default function TimerAd() {
  const adContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (adContainerRef.current) {
      // Create the first script for atOptions
      const optionsScript = document.createElement('script')
      optionsScript.type = 'text/javascript'
      optionsScript.innerHTML = `
        atOptions = {
          'key' : 'cc902bc9e7460ee4307f2cc068b1cdf7',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `
      
      // Create the second script for the ad
      const adScript = document.createElement('script')
      adScript.type = 'text/javascript'
      adScript.src = '//countersuspiciousdiverse.com/cc902bc9e7460ee4307f2cc068b1cdf7/invoke.js'
      
      // Append both scripts to the container
      adContainerRef.current.appendChild(optionsScript)
      adContainerRef.current.appendChild(adScript)
      
      // Cleanup function
      return () => {
        if (adContainerRef.current) {
          adContainerRef.current.innerHTML = ''
        }
      }
    }
  }, [])

  return (
    <div 
      ref={adContainerRef}
      className="flex items-center justify-center min-h-[60px]"
      style={{ minWidth: '468px', maxWidth: '100%' }}
    />
  )
} 