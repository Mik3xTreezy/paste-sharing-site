"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, AlertTriangle } from 'lucide-react'

export default function AntiAdblock() {
  const [showAdblockWarning, setShowAdblockWarning] = useState(false)
  const [adblockDetected, setAdblockDetected] = useState(false)

  useEffect(() => {
    // Function to detect adblock
    const detectAdblock = () => {
      let adblockDetected = false

      // Method 1: Check if Google AdSense script is blocked
      const testAd = document.createElement('div')
      testAd.innerHTML = '&nbsp;'
      testAd.className = 'adsbox'
      testAd.style.position = 'absolute'
      testAd.style.left = '-10000px'
      testAd.style.top = '-1000px'
      testAd.style.width = '1px'
      testAd.style.height = '1px'
      testAd.style.overflow = 'hidden'
      document.body.appendChild(testAd)

      // Check if the ad element is hidden by adblock
      setTimeout(() => {
        const isBlocked = testAd.offsetHeight === 0 || testAd.offsetWidth === 0
        document.body.removeChild(testAd)
        
        if (isBlocked) {
          adblockDetected = true
        }
      }, 100)

      // Method 2: Check if Google Analytics is blocked (common adblock target)
      const gaBlocked = typeof window !== 'undefined' && 
        (window.ga === undefined || window.gtag === undefined)
      
      if (gaBlocked) {
        adblockDetected = true
      }

      // Method 3: Check for common adblock patterns
      const adblockPatterns = [
        'adsbygoogle',
        'googleadservices',
        'doubleclick',
        'googlesyndication'
      ]

      const scripts = document.querySelectorAll('script')
      let blockedScripts = 0
      
      scripts.forEach(script => {
        if (script.src) {
          adblockPatterns.forEach(pattern => {
            if (script.src.includes(pattern)) {
              blockedScripts++
            }
          })
        }
      })

      if (blockedScripts > 0) {
        adblockDetected = true
      }

      // Only show warning if adblock is actually detected
      if (adblockDetected) {
        setAdblockDetected(true)
        setShowAdblockWarning(true)
      }
    }

    // Run detection after a short delay
    const timer = setTimeout(detectAdblock, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Function to check if ads are loading properly
  const checkAdsLoaded = () => {
    // Only check if we haven't already detected adblock
    if (adblockDetected) return
    
    // Check if Google AdSense script is loaded
    const googleAdsenseScript = document.querySelector('script[src*="adsbygoogle"]')
    const adsbygoogleFunction = typeof window !== 'undefined' && (window as any).adsbygoogle
    
    // Check if both script and function are available
    if (!googleAdsenseScript || !adsbygoogleFunction) {
      setAdblockDetected(true)
      setShowAdblockWarning(true)
    }
  }

  // Check ads after a longer delay
  useEffect(() => {
    const timer = setTimeout(checkAdsLoaded, 8000)
    return () => clearTimeout(timer)
  }, [adblockDetected])

  if (!showAdblockWarning) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 max-w-md w-full relative">


        {/* Warning icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Adblock Detected</h2>
          <p className="text-gray-400 text-sm">
            We detected that you're using an ad blocker. Please disable it to access our content.
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">How to disable Adblock:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Click the adblock icon in your browser toolbar</li>
              <li>• Select "Disable for this site" or "Allow ads"</li>
              <li>• Refresh the page</li>
            </ul>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 text-lg font-semibold"
          >
            Refresh Page
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          We rely on ads to keep this service free. Thank you for your support!
        </p>
      </div>
    </div>
  )
} 