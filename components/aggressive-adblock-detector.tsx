"use client"

import { useEffect, useState } from 'react'

interface AggressiveAdblockDetectorProps {
  onAdblockDetected?: () => void
  onAdblockNotDetected?: () => void
  showWarning?: boolean
  customWarningMessage?: string
  checkInterval?: number
}

export default function AggressiveAdblockDetector({ 
  onAdblockDetected, 
  onAdblockNotDetected, 
  showWarning = true,
  customWarningMessage,
  checkInterval = 2000
}: AggressiveAdblockDetectorProps) {
  const [isAdblockDetected, setIsAdblockDetected] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const detectAdblockAggressively = () => {
    let detectionCount = 0
    const totalTests = 8

    // Test 1: Check if adsbygoogle function exists
    if (typeof (window as any).adsbygoogle === 'undefined') {
      detectionCount++
      console.log('Test 1: adsbygoogle function missing')
    }

    // Test 2: Check if Google Analytics is blocked
    if (typeof (window as any).ga === 'undefined' && typeof (window as any).gtag === 'undefined') {
      detectionCount++
      console.log('Test 2: Google Analytics blocked')
    }

    // Test 3: Check if test ad elements are blocked
    const testElements = ['adsbox', 'advertisement', 'ads', 'ad', 'adsbygoogle', 'google-ad', 'doubleclick', 'banner-ad']
    let blockedElements = 0
    
    testElements.forEach(className => {
      const element = document.querySelector(`.${className}`)
      if (!element || element.offsetHeight === 0 || element.offsetWidth === 0) {
        blockedElements++
      }
    })
    
    if (blockedElements >= 3) {
      detectionCount++
      console.log(`Test 3: ${blockedElements} ad elements blocked`)
    }

    // Test 4: Check if ad-related scripts are blocked
    const adScripts = [
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      'https://www.googletagmanager.com/gtag/js',
      'https://www.google-analytics.com/analytics.js',
      'https://www.googleadservices.com/pagead/conversion.js'
    ]
    
    let blockedScripts = 0
    adScripts.forEach(src => {
      const script = document.querySelector(`script[src="${src}"]`)
      if (!script) {
        blockedScripts++
      }
    })
    
    if (blockedScripts >= 2) {
      detectionCount++
      console.log(`Test 4: ${blockedScripts} ad scripts blocked`)
    }

    // Test 5: Check for uBlock Origin specific patterns
    const uBlockPatterns = [
      'ublock',
      'adblock',
      'adblockplus',
      'ghostery',
      'privacy-badger'
    ]
    
    let uBlockDetected = false
    uBlockPatterns.forEach(pattern => {
      if (document.querySelector(`[class*="${pattern}"]`) || 
          document.querySelector(`[id*="${pattern}"]`) ||
          (window as any)[pattern]) {
        uBlockDetected = true
      }
    })
    
    if (uBlockDetected) {
      detectionCount++
      console.log('Test 5: uBlock/adblock patterns detected')
    }

    // Test 6: Check if common ad selectors are blocked
    const adSelectors = [
      '[class*="ad-"]',
      '[class*="ads-"]',
      '[id*="ad-"]',
      '[id*="ads-"]',
      '[class*="banner"]',
      '[class*="sponsor"]'
    ]
    
    let blockedSelectors = 0
    adSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      if (elements.length === 0) {
        blockedSelectors++
      }
    })
    
    if (blockedSelectors >= 2) {
      detectionCount++
      console.log(`Test 6: ${blockedSelectors} ad selectors blocked`)
    }

    // Test 7: Check if Google Tag Manager is blocked
    if (typeof (window as any).dataLayer === 'undefined') {
      detectionCount++
      console.log('Test 7: Google Tag Manager blocked')
    }

    // Test 8: Check if Facebook Pixel is blocked
    if (typeof (window as any).fbq === 'undefined') {
      detectionCount++
      console.log('Test 8: Facebook Pixel blocked')
    }

    // If more than 50% of tests detect adblock, consider it active
    const isBlocked = detectionCount >= Math.ceil(totalTests * 0.5)
    
    console.log(`Adblock detection: ${detectionCount}/${totalTests} tests positive`)

    if (isBlocked) {
      console.log('🚫 AGGRESSIVE AD BLOCKER DETECTED!')
      setIsAdblockDetected(true)
      onAdblockDetected?.()
      
      if (showWarning && !showModal) {
        setShowModal(true)
        showAggressiveWarning()
      }
    } else {
      console.log('✅ No ad blocker detected')
      setIsAdblockDetected(false)
      onAdblockNotDetected?.()
    }

    return isBlocked
  }

  const showAggressiveWarning = () => {
    // Remove any existing modal first
    const existingModal = document.getElementById('aggressive-adblock-modal')
    if (existingModal) {
      existingModal.remove()
    }

    const modal = document.createElement('div')
    modal.id = 'aggressive-adblock-modal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.98);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      backdrop-filter: blur(15px);
    `

    const content = document.createElement('div')
    content.style.cssText = `
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 50px;
      border-radius: 25px;
      max-width: 700px;
      text-align: center;
      box-shadow: 0 30px 100px rgba(0, 0, 0, 0.7);
      border: 2px solid #e74c3c;
      color: white;
      animation: aggressiveSlideIn 0.4s ease-out;
    `

    // Add CSS animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes aggressiveSlideIn {
        from {
          opacity: 0;
          transform: translateY(-100px) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes aggressivePulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
        50% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(231, 76, 60, 0); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `
    document.head.appendChild(style)

    const message = customWarningMessage || 
      "🚫 AD BLOCKER DETECTED! We've detected that you're using an ad blocker (likely uBlock Origin). Our paste sharing service relies on advertising to remain free and accessible to everyone. Please disable your ad blocker for this site to continue using our services."

    content.innerHTML = `
      <div style="margin-bottom: 40px;">
        <div style="
          width: 120px;
          height: 120px;
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          font-size: 60px;
          animation: aggressivePulse 2s infinite;
          box-shadow: 0 15px 40px rgba(231, 76, 60, 0.4);
          border: 3px solid #fff;
        ">🚫</div>
        <h2 style="
          color: #e74c3c;
          margin: 0 0 25px 0;
          font-size: 36px;
          font-weight: bold;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
          animation: shake 0.5s ease-in-out;
        ">🚫 AD BLOCKER DETECTED!</h2>
        <p style="
          color: #ccc;
          line-height: 1.8;
          margin: 0 0 35px 0;
          font-size: 20px;
        ">${message}</p>
      </div>
      
      <div style="
        background: rgba(231, 76, 60, 0.1);
        padding: 30px;
        border-radius: 20px;
        margin-bottom: 35px;
        text-align: left;
        border: 1px solid rgba(231, 76, 60, 0.3);
      ">
        <h3 style="
          color: #e74c3c;
          margin: 0 0 25px 0;
          font-size: 24px;
          display: flex;
          align-items: center;
          gap: 15px;
        ">
          <span style="font-size: 28px;">🔧</span>
          How to disable your ad blocker:
        </h3>
        <ul style="
          color: #ccc;
          margin: 0;
          padding-left: 30px;
          line-height: 2.2;
          font-size: 18px;
        ">
          <li><strong style="color: #e74c3c;">uBlock Origin:</strong> Click the red "u" icon → "Pause uBlock" or "Allow ads on this site"</li>
          <li><strong style="color: #e74c3c;">AdBlock:</strong> Click the AdBlock icon → "Don't run on pages on this domain"</li>
          <li><strong style="color: #e74c3c;">AdBlock Plus:</strong> Click the ABP icon → "Disable on this site"</li>
          <li><strong style="color: #e74c3c;">Other blockers:</strong> Look for similar options in your ad blocker's menu</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
        <button id="disable-adblock-btn" style="
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          padding: 20px 40px;
          border-radius: 15px;
          cursor: pointer;
          font-weight: bold;
          font-size: 18px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(231, 76, 60, 0.4);
          border: 2px solid #fff;
        " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 12px 30px rgba(231, 76, 60, 0.6)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 20px rgba(231, 76, 60, 0.4)'">
          🚫 DISABLE AD BLOCKER NOW
        </button>
        <button id="refresh-page-btn" style="
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          border: none;
          padding: 20px 40px;
          border-radius: 15px;
          cursor: pointer;
          font-weight: bold;
          font-size: 18px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
          border: 2px solid #fff;
        " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 12px 30px rgba(52, 152, 219, 0.6)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 20px rgba(52, 152, 219, 0.4)'">
          🔄 REFRESH PAGE
        </button>
        <button id="close-warning-btn" style="
          background: linear-gradient(45deg, #95a5a6, #7f8c8d);
          color: white;
          border: none;
          padding: 20px 40px;
          border-radius: 15px;
          cursor: pointer;
          font-weight: bold;
          font-size: 18px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(149, 165, 166, 0.4);
          border: 2px solid #fff;
        " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 12px 30px rgba(149, 165, 166, 0.6)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 8px 20px rgba(149, 165, 166, 0.4)'">
          ❌ CLOSE
        </button>
      </div>
      
      <p style="
        color: #888;
        font-size: 16px;
        margin: 30px 0 0 0;
        line-height: 1.6;
      ">
        💡 <strong>Important:</strong> We rely on ads to keep this service free. Thank you for your support!
      </p>
    `

    modal.appendChild(content)
    document.body.appendChild(modal)

    // Event listeners
    document.getElementById('disable-adblock-btn')?.addEventListener('click', () => {
      window.open('https://help.getadblock.com/support/solutions/articles/4000055640', '_blank')
    })

    document.getElementById('refresh-page-btn')?.addEventListener('click', () => {
      window.location.reload()
    })

    document.getElementById('close-warning-btn')?.addEventListener('click', () => {
      modal.remove()
      setShowModal(false)
    })

    // Auto-close after 120 seconds
    setTimeout(() => {
      if (document.body.contains(modal)) {
        modal.remove()
        setShowModal(false)
      }
    }, 120000)
  }

  useEffect(() => {
    // Initial detection with delay
    const initialTimeout = setTimeout(() => {
      detectAdblockAggressively()
    }, 1000)

    // Set up periodic checking
    const interval = setInterval(() => {
      detectAdblockAggressively()
    }, checkInterval)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
      
      // Clean up modal on unmount
      const existingModal = document.getElementById('aggressive-adblock-modal')
      if (existingModal) {
        existingModal.remove()
      }
    }
  }, [checkInterval, showWarning, customWarningMessage])

  return null
}
