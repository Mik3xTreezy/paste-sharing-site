"use client"

import { useEffect } from 'react'

export default function HighPerformanceAd() {
  useEffect(() => {
    // Load the high performance ad script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = `
      atOptions = {
        'key' : 'f6de01476008427724c09b2f40bd9772',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `
    document.head.appendChild(script)

    // Load the invoke script
    const invokeScript = document.createElement('script')
    invokeScript.type = 'text/javascript'
    invokeScript.src = '//www.highperformanceformat.com/f6de01476008427724c09b2f40bd9772/invoke.js'
    invokeScript.async = true
    document.head.appendChild(invokeScript)

    return () => {
      // Cleanup scripts when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      if (document.head.contains(invokeScript)) {
        document.head.removeChild(invokeScript)
      }
    }
  }, [])

  return (
    <div className="flex justify-center items-center min-h-[60px]">
      <div 
        id="container-f6de01476008427724c09b2f40bd9772"
        className="w-full max-w-[468px] h-[60px]"
      />
    </div>
  )
} 