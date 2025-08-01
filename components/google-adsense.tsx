"use client"

import { useEffect } from 'react'

export default function GoogleAdSense() {
  useEffect(() => {
    // Load Google AdSense script
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5777656899630692'
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    // Initialize ad when script loads
    script.onload = () => {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Pastescript_1 */}
        <ins 
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-5777656899630692"
          data-ad-slot="8234568804"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
} 