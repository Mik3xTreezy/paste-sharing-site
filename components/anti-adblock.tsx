"use client"

import { useEffect } from 'react'

interface AntiAdblockProps {
  onAdblockDetected?: () => void
  onAdblockNotDetected?: () => void
  showWarning?: boolean
}

export default function AntiAdblock({ 
  onAdblockDetected, 
  onAdblockNotDetected, 
  showWarning = true 
}: AntiAdblockProps) {
  useEffect(() => {
    // Anti-adblock detection script
    const AdblockRegixFinder = {
      class: [/\[\[\[\[(.*)\]\]\]\]/gm, /\[\[\[(.*)\]\]\]/gm, /\[\[(.*)\]\]/gm],
      squarebracket: /[\[\]']+/g,
      settings: /\{\{(.*)\}\}/gm,
      curlbrackets: /[{}]/g,
      classfind: (className: string) => new RegExp('(\\s|^)' + className + '(\\s|$)'),
      linebreak: /(?:\r\n|\r|\n)/g,
      whitespace: /\s+/g
    }

    // Obfuscated decoder function
    const _0xc19e = ["", "split", "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/", "slice", "indexOf", "", "", ".", "pow", "reduce", "reverse", "0"]

    function _0xe92c(d: string, e: number, f: number) {
      const g = _0xc19e[2][_0xc19e[1]](_0xc19e[0])
      const h = g[_0xc19e[3]](0, e)
      const i = g[_0xc19e[3]](0, f)
      const j = d[_0xc19e[1]](_0xc19e[0])[_0xc19e[10]]()[_0xc19e[9]](function(a: number, b: string, c: number) {
        if (h[_0xc19e[4]](b) !== -1) return a += h[_0xc19e[4]](b) * (Math[_0xc19e[8]](e, c))
        return a
      }, 0)
      let k = _0xc19e[0]
      while (j > 0) {
        k = i[j % f] + k
        j = (j - (j % f)) / f
      }
      return k || _0xc19e[11]
    }

    // Main detection logic
    function detectAdblock() {
      try {
        // Create test elements
        const testDiv = document.createElement('div')
        testDiv.className = 'adsbox'
        testDiv.style.position = 'absolute'
        testDiv.style.left = '-9999px'
        testDiv.style.top = '-9999px'
        testDiv.innerHTML = '&nbsp;'
        document.body.appendChild(testDiv)

        // Check if adblock is active
        const isAdblockActive = testDiv.offsetHeight === 0 || 
                               testDiv.offsetWidth === 0 || 
                               testDiv.clientHeight === 0 || 
                               testDiv.clientWidth === 0

        // Clean up
        document.body.removeChild(testDiv)

        if (isAdblockActive) {
          console.log('Ad blocker detected')
          onAdblockDetected?.()
          
          if (showWarning) {
            showAdblockWarning()
          }
        } else {
          console.log('No ad blocker detected')
          onAdblockNotDetected?.()
        }

        return isAdblockActive
      } catch (error) {
        console.error('Error detecting ad blocker:', error)
        return false
      }
    }

    function showAdblockWarning() {
      // Create warning modal
      const warningModal = document.createElement('div')
      warningModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
      `

      const warningContent = document.createElement('div')
      warningContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      `

      warningContent.innerHTML = `
        <h2 style="color: #e74c3c; margin-bottom: 20px;">⚠️ Ad Blocker Detected</h2>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
          We've detected that you're using an ad blocker. Our service relies on advertising to remain free and accessible to everyone.
        </p>
        <p style="color: #666; font-size: 14px; margin-bottom: 25px;">
          Please disable your ad blocker for this site to continue using our services.
        </p>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <button id="disable-adblock" style="
            background: #e74c3c;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
          ">Disable Ad Blocker</button>
          <button id="close-warning" style="
            background: #95a5a6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
          ">Close</button>
        </div>
      `

      warningModal.appendChild(warningContent)
      document.body.appendChild(warningModal)

      // Add event listeners
      document.getElementById('disable-adblock')?.addEventListener('click', () => {
        window.open('https://help.getadblock.com/support/solutions/articles/4000055640', '_blank')
      })

      document.getElementById('close-warning')?.addEventListener('click', () => {
        document.body.removeChild(warningModal)
      })

      // Auto-close after 30 seconds
      setTimeout(() => {
        if (document.body.contains(warningModal)) {
          document.body.removeChild(warningModal)
        }
      }, 30000)
    }

    // Run detection after a short delay
    const detectionTimeout = setTimeout(() => {
      detectAdblock()
    }, 1000)

    // Cleanup
    return () => {
      clearTimeout(detectionTimeout)
    }
  }, [onAdblockDetected, onAdblockNotDetected, showWarning])

  return null // This component doesn't render anything
} 