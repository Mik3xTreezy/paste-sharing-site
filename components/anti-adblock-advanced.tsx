"use client"

import { useEffect } from 'react'

interface AntiAdblockAdvancedProps {
  onAdblockDetected?: () => void
  onAdblockNotDetected?: () => void
  showWarning?: boolean
  customWarningMessage?: string
}

export default function AntiAdblockAdvanced({ 
  onAdblockDetected, 
  onAdblockNotDetected, 
  showWarning = true,
  customWarningMessage
}: AntiAdblockAdvancedProps) {
  useEffect(() => {
    // Advanced anti-adblock detection with obfuscated script
    const AdblockRegixFinder = { 
      class: [/\[\[\[\[(.*)\]\]\]\]/gm, /\[\[\[(.*)\]\]\]/gm, /\[\[(.*)\]\]/gm], 
      squarebracket: /[\[\]']+/g, 
      settings: /\{\{(.*)\}\}/gm, 
      curlbrackets: /[{}]/g, 
      classfind: (className: string) => new RegExp('(\\s|^)' + className + '(\\s|$)'), 
      linebreak: /(?:\r\n|\r|\n)/g, 
      whitespace: /\s+/g 
    }

    // Obfuscated decoder
    const _0xc19e = ["","split","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/","slice","indexOf","","",".","pow","reduce","reverse","0"]
    
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

    // Main detection function
    function detectAdblockAdvanced() {
      try {
        // Multiple detection methods
        const methods = [
          // Method 1: Element-based detection
          () => {
            const testDiv = document.createElement('div')
            testDiv.className = 'adsbox'
            testDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;'
            testDiv.innerHTML = '&nbsp;'
            document.body.appendChild(testDiv)
            
            const isBlocked = testDiv.offsetHeight === 0 || testDiv.offsetWidth === 0
            document.body.removeChild(testDiv)
            return isBlocked
          },
          
          // Method 2: Script-based detection
          () => {
            const adScripts = ['adsbygoogle', 'googleadservices', 'doubleclick', 'googlesyndication']
            const scripts = document.querySelectorAll('script')
            let blockedCount = 0
            
            scripts.forEach(script => {
              if (script.src) {
                adScripts.forEach(pattern => {
                  if (script.src.includes(pattern)) {
                    blockedCount++
                  }
                })
              }
            })
            
            return blockedCount === 0
          },
          
          // Method 3: Function-based detection
          () => {
            return typeof (window as any).adsbygoogle === 'undefined'
          }
        ]

        // Run all detection methods
        const results = methods.map(method => {
          try {
            return method()
          } catch {
            return false
          }
        })

        // If majority of methods detect adblock, consider it active
        const adblockDetected = results.filter(Boolean).length >= 2

        if (adblockDetected) {
          console.log('Advanced ad blocker detection: BLOCKED')
          onAdblockDetected?.()
          
          if (showWarning) {
            showAdvancedWarning()
          }
        } else {
          console.log('Advanced ad blocker detection: CLEAR')
          onAdblockNotDetected?.()
        }

        return adblockDetected
      } catch (error) {
        console.error('Advanced adblock detection error:', error)
        return false
      }
    }

    function showAdvancedWarning() {
      const warningModal = document.createElement('div')
      warningModal.id = 'adblock-warning-modal'
      warningModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `

      const warningContent = document.createElement('div')
      warningContent.style.cssText = `
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        padding: 40px;
        border-radius: 15px;
        max-width: 600px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        border: 1px solid #333;
        color: white;
      `

      const message = customWarningMessage || 
        "We've detected that you're using an ad blocker. Our service relies on advertising to remain free and accessible to everyone. Please disable your ad blocker for this site to continue using our services."

      warningContent.innerHTML = `
        <div style="margin-bottom: 30px;">
          <div style="
            width: 80px;
            height: 80px;
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 40px;
          ">⚠️</div>
          <h2 style="
            color: #e74c3c;
            margin: 0 0 20px 0;
            font-size: 28px;
            font-weight: bold;
          ">Ad Blocker Detected</h2>
          <p style="
            color: #ccc;
            line-height: 1.6;
            margin: 0 0 25px 0;
            font-size: 16px;
          ">${message}</p>
        </div>
        
        <div style="
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          text-align: left;
        ">
          <h3 style="
            color: #fff;
            margin: 0 0 15px 0;
            font-size: 18px;
          ">How to disable your ad blocker:</h3>
          <ul style="
            color: #ccc;
            margin: 0;
            padding-left: 20px;
            line-height: 1.8;
          ">
            <li>Click the ad blocker icon in your browser toolbar</li>
            <li>Select "Disable for this site" or "Allow ads"</li>
            <li>Refresh this page</li>
          </ul>
        </div>
        
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <button id="disable-adblock-btn" style="
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Disable Ad Blocker
          </button>
          <button id="refresh-page-btn" style="
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Refresh Page
          </button>
          <button id="close-warning-btn" style="
            background: linear-gradient(45deg, #95a5a6, #7f8c8d);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Close
          </button>
        </div>
        
        <p style="
          color: #888;
          font-size: 12px;
          margin: 20px 0 0 0;
        ">
          We rely on ads to keep this service free. Thank you for your support!
        </p>
      `

      warningModal.appendChild(warningContent)
      document.body.appendChild(warningModal)

      // Event listeners
      document.getElementById('disable-adblock-btn')?.addEventListener('click', () => {
        window.open('https://help.getadblock.com/support/solutions/articles/4000055640', '_blank')
      })

      document.getElementById('refresh-page-btn')?.addEventListener('click', () => {
        window.location.reload()
      })

      document.getElementById('close-warning-btn')?.addEventListener('click', () => {
        if (document.body.contains(warningModal)) {
          document.body.removeChild(warningModal)
        }
      })

      // Auto-close after 60 seconds
      setTimeout(() => {
        if (document.body.contains(warningModal)) {
          document.body.removeChild(warningModal)
        }
      }, 60000)
    }

    // Run detection with delay
    const detectionTimeout = setTimeout(() => {
      detectAdblockAdvanced()
    }, 2000)

    // Periodic re-checking
    const periodicCheck = setInterval(() => {
      detectAdblockAdvanced()
    }, 30000) // Check every 30 seconds

    return () => {
      clearTimeout(detectionTimeout)
      clearInterval(periodicCheck)
      
      // Clean up any existing warning modal
      const existingModal = document.getElementById('adblock-warning-modal')
      if (existingModal && document.body.contains(existingModal)) {
        document.body.removeChild(existingModal)
      }
    }
  }, [onAdblockDetected, onAdblockNotDetected, showWarning, customWarningMessage])

  return null
}
