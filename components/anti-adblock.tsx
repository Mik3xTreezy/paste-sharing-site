"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function AntiAdblock() {
  const [showAdblockWarning, setShowAdblockWarning] = useState(false)

  useEffect(() => {
    // Import blockadblock dynamically
    const loadBlockAdblock = async () => {
      try {
        const { default: blockAdblock } = await import('blockadblock')
        
        // Initialize blockadblock
        blockAdblock.onDetected(() => {
          console.log('Adblock detected!')
          setShowAdblockWarning(true)
        })

        // Start detection
        blockAdblock.onNotDetected(() => {
          console.log('No adblock detected')
          setShowAdblockWarning(false)
        })

        // Set detection options
        blockAdblock.setOption('checkOnLoad', true)
        blockAdblock.setOption('resetOnEnd', false)
        
        // Start the detection
        blockAdblock.start()
        
      } catch (error) {
        console.error('Failed to load blockadblock:', error)
        // Fallback to manual detection if blockadblock fails
        setTimeout(() => {
          // Method 1: Check if ad elements are blocked
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

          setTimeout(() => {
            const isBlocked = testAd.offsetHeight === 0 || testAd.offsetWidth === 0
            document.body.removeChild(testAd)
            
            if (isBlocked) {
              console.log('Manual detection: Adblock found')
              setShowAdblockWarning(true)
              return
            }

            // Method 2: Check if Google AdSense script is blocked
            const googleAdsenseScript = document.querySelector('script[src*="adsbygoogle"]')
            const adsbygoogleFunction = typeof window !== 'undefined' && (window as any).adsbygoogle
            
            if (!googleAdsenseScript || !adsbygoogleFunction) {
              console.log('Manual detection: Google AdSense blocked')
              setShowAdblockWarning(true)
              return
            }

            // Method 3: Check for blocked ad-related scripts
            const adblockPatterns = ['adsbygoogle', 'googleadservices', 'doubleclick', 'googlesyndication']
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

            if (blockedScripts === 0) {
              console.log('Manual detection: No ad scripts found')
              setShowAdblockWarning(true)
            }
          }, 100)
        }, 3000)
      }
    }

    loadBlockAdblock()
  }, [])

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