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
          setAdblockDetected(true)
          setShowAdblockWarning(true)
        }
      }, 100)

      // Method 2: Check if Google Analytics is blocked (common adblock target)
      const gaBlocked = typeof window !== 'undefined' && 
        (window.ga === undefined || window.gtag === undefined)
      
      if (gaBlocked) {
        setAdblockDetected(true)
        setShowAdblockWarning(true)
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
        setAdblockDetected(true)
        setShowAdblockWarning(true)
      }
    }

    // Run detection after a short delay
    const timer = setTimeout(detectAdblock, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Function to check if ads are loading properly
  const checkAdsLoaded = () => {
    const adElements = document.querySelectorAll('[id*="google_ads"], [id*="adsbygoogle"]')
    if (adElements.length === 0) {
      setAdblockDetected(true)
      setShowAdblockWarning(true)
    }
  }

  // Check ads after a longer delay
  useEffect(() => {
    const timer = setTimeout(checkAdsLoaded, 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!showAdblockWarning) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={() => setShowAdblockWarning(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

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

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white flex-1"
          >
            Refresh Page
          </Button>
          <Button
            onClick={() => setShowAdblockWarning(false)}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 flex-1"
          >
            Continue Anyway
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