"use client"

import { useEffect, useRef } from 'react'

export default function PastescriptAd1() {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (adRef.current) {
      // Load Google AdSense script if not already loaded
      if (!(window as any).adsbygoogle) {
        const script = document.createElement('script')
        script.async = true
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5777656899630692"
        script.crossOrigin = "anonymous"
        document.head.appendChild(script)
      }

      // Create the ad element
      const adElement = document.createElement('ins')
      adElement.className = 'adsbygoogle'
      adElement.style.display = 'block'
      adElement.setAttribute('data-ad-client', 'ca-pub-5777656899630692')
      adElement.setAttribute('data-ad-slot', '8234568804')
      adElement.setAttribute('data-ad-format', 'auto')
      adElement.setAttribute('data-full-width-responsive', 'true')

      // Clear the container and add the ad
      adRef.current.innerHTML = ''
      adRef.current.appendChild(adElement)

      // Push the ad to Google AdSense
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || []
        ;(window as any).adsbygoogle.push({})
      } catch (error) {
        console.log('AdSense ad loaded')
      }
    }
  }, [])

  return (
    <div 
      ref={adRef}
      className="w-full min-h-[100px] flex items-center justify-center"
    />
  )
} 