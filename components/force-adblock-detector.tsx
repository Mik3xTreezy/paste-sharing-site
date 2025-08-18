"use client"

import { useEffect, useState } from 'react'

interface ForceAdblockDetectorProps {
  onAdblockDetected?: () => void
  onAdblockNotDetected?: () => void
  showWarning?: boolean
  customWarningMessage?: string
  forceDetection?: boolean
}

export default function ForceAdblockDetector({ 
  onAdblockDetected, 
  onAdblockNotDetected, 
  showWarning = true,
  customWarningMessage,
  forceDetection = true
}: ForceAdblockDetectorProps) {
  const [isAdblockDetected, setIsAdblockDetected] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const forceDetectAdblock = () => {
    console.log('🔍 FORCE DETECTING AD BLOCKER...')
    
    let detectionScore = 0
    const maxScore = 100

    // Method 1: Direct element creation and immediate check
    try {
      const testDiv = document.createElement('div')
      testDiv.id = 'force-ad-test'
      testDiv.className = 'adsbox advertisement ads ad adsbygoogle google-ad doubleclick banner-ad'
      testDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:100px;height:100px;background:red;z-index:999999;'
      testDiv.innerHTML = '<div style="width:100%;height:100%;background:blue;">AD TEST</div>'
      
      document.body.appendChild(testDiv)
      
      // Immediate check
      setTimeout(() => {
        const element = document.getElementById('force-ad-test')
        if (!element || element.offsetHeight === 0 || element.offsetWidth === 0) {
          detectionScore += 30
          console.log('🚫 FORCE TEST: Ad element blocked (30 points)')
        } else {
          console.log('✅ FORCE TEST: Ad element visible')
        }
        
        // Clean up
        if (element) {
          element.remove()
        }
      }, 100)
    } catch (error) {
      console.log('🚫 FORCE TEST: Error creating test element (20 points)')
      detectionScore += 20
    }

    // Method 2: Check for blocked scripts immediately
    const blockedScripts = [
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      'https://www.googletagmanager.com/gtag/js',
      'https://www.google-analytics.com/analytics.js',
      'https://www.googleadservices.com/pagead/conversion.js',
      'https://www.facebook.com/tr',
      'https://connect.facebook.net/en_US/fbevents.js'
    ]

    blockedScripts.forEach(src => {
      const script = document.querySelector(`script[src="${src}"]`)
      if (!script) {
        detectionScore += 5
        console.log(`🚫 SCRIPT BLOCKED: ${src} (5 points)`)
      }
    })

    // Method 3: Check for missing global functions
    const missingFunctions = [
      'adsbygoogle',
      'ga',
      'gtag',
      'fbq',
      'dataLayer'
    ]

    missingFunctions.forEach(funcName => {
      if (typeof (window as any)[funcName] === 'undefined') {
        detectionScore += 8
        console.log(`🚫 FUNCTION MISSING: ${funcName} (8 points)`)
      }
    })

    // Method 4: Check for uBlock Origin specific indicators
    const uBlockIndicators = [
      'ublock',
      'adblock',
      'adblockplus',
      'ghostery',
      'privacy-badger'
    ]

    uBlockIndicators.forEach(indicator => {
      if (document.querySelector(`[class*="${indicator}"]`) || 
          document.querySelector(`[id*="${indicator}"]`) ||
          (window as any)[indicator]) {
        detectionScore += 15
        console.log(`🚫 UBLOCK INDICATOR: ${indicator} (15 points)`)
      }
    })

    // Method 5: Force create multiple test elements
    const testElements = [
      'adsbox', 'advertisement', 'ads', 'ad', 'adsbygoogle', 'google-ad',
      'doubleclick', 'banner-ad', 'ad-container', 'ad-wrapper', 'ad-unit',
      'ad-space', 'ad-slot', 'ad-banner', 'ad-sidebar', 'ad-header', 'ad-footer'
    ]

    let blockedElements = 0
    testElements.forEach(className => {
      const element = document.querySelector(`.${className}`)
      if (!element || element.offsetHeight === 0 || element.offsetWidth === 0) {
        blockedElements++
      }
    })

    if (blockedElements >= 5) {
      detectionScore += 25
      console.log(`🚫 ELEMENTS BLOCKED: ${blockedElements}/${testElements.length} (25 points)`)
    }

    // Method 6: Check if Google Analytics is actually working
    try {
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'adblock_test', {
          'event_category': 'adblock',
          'event_label': 'test'
        })
        console.log('✅ Google Analytics working')
      } else {
        detectionScore += 10
        console.log('🚫 Google Analytics not working (10 points)')
      }
    } catch (error) {
      detectionScore += 10
      console.log('🚫 Google Analytics error (10 points)')
    }

    console.log(`🎯 FORCE DETECTION SCORE: ${detectionScore}/${maxScore}`)

    // If score is above 40, consider adblock detected
    const isBlocked = detectionScore >= 40

    if (isBlocked) {
      console.log('🚫 FORCE AD BLOCKER DETECTED!')
      setIsAdblockDetected(true)
      onAdblockDetected?.()
      
      if (showWarning && !showModal) {
        setShowModal(true)
        showForceWarning()
      }
    } else {
      console.log('✅ FORCE: No ad blocker detected')
      setIsAdblockDetected(false)
      onAdblockNotDetected?.()
    }

    return isBlocked
  }

  const showForceWarning = () => {
    // Remove any existing modal first
    const existingModal = document.getElementById('force-adblock-modal')
    if (existingModal) {
      existingModal.remove()
    }

    const modal = document.createElement('div')
    modal.id = 'force-adblock-modal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.99);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      backdrop-filter: blur(20px);
    `

    const content = document.createElement('div')
    content.style.cssText = `
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 60px;
      border-radius: 30px;
      max-width: 800px;
      text-align: center;
      box-shadow: 0 40px 120px rgba(0, 0, 0, 0.8);
      border: 3px solid #e74c3c;
      color: white;
      animation: forceSlideIn 0.5s ease-out;
    `

    // Add CSS animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes forceSlideIn {
        from {
          opacity: 0;
          transform: translateY(-150px) scale(0.7);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes forcePulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.8); }
        50% { transform: scale(1.15); box-shadow: 0 0 0 30px rgba(231, 76, 60, 0); }
      }
      @keyframes forceShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
      }
      @keyframes forceGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(231, 76, 60, 0.5); }
        50% { box-shadow: 0 0 40px rgba(231, 76, 60, 0.8); }
      }
    `
    document.head.appendChild(style)

    const message = customWarningMessage || 
      "🚫 FORCE DETECTION: AD BLOCKER DETECTED! We've detected that you're using an ad blocker (uBlock Origin). Our paste sharing service relies on advertising to remain free and accessible to everyone. Please disable your ad blocker for this site to continue using our services."

    content.innerHTML = `
      <div style="margin-bottom: 50px;">
        <div style="
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 40px;
          font-size: 80px;
          animation: forcePulse 1.5s infinite;
          box-shadow: 0 20px 60px rgba(231, 76, 60, 0.5);
          border: 4px solid #fff;
        ">🚫</div>
        <h2 style="
          color: #e74c3c;
          margin: 0 0 30px 0;
          font-size: 42px;
          font-weight: bold;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
          animation: forceShake 0.6s ease-in-out;
        ">🚫 FORCE DETECTION: AD BLOCKER!</h2>
        <p style="
          color: #ccc;
          line-height: 1.9;
          margin: 0 0 40px 0;
          font-size: 22px;
        ">${message}</p>
      </div>
      
      <div style="
        background: rgba(231, 76, 60, 0.15);
        padding: 40px;
        border-radius: 25px;
        margin-bottom: 40px;
        text-align: left;
        border: 2px solid rgba(231, 76, 60, 0.4);
        animation: forceGlow 2s infinite;
      ">
        <h3 style="
          color: #e74c3c;
          margin: 0 0 30px 0;
          font-size: 28px;
          display: flex;
          align-items: center;
          gap: 20px;
        ">
          <span style="font-size: 32px;">🔧</span>
          IMMEDIATE ACTION REQUIRED:
        </h3>
        <ul style="
          color: #ccc;
          margin: 0;
          padding-left: 35px;
          line-height: 2.5;
          font-size: 20px;
        ">
          <li><strong style="color: #e74c3c;">uBlock Origin:</strong> Click the red "u" icon → "Pause uBlock" or "Allow ads on this site"</li>
          <li><strong style="color: #e74c3c;">AdBlock:</strong> Click the AdBlock icon → "Don't run on pages on this domain"</li>
          <li><strong style="color: #e74c3c;">AdBlock Plus:</strong> Click the ABP icon → "Disable on this site"</li>
          <li><strong style="color: #e74c3c;">Other blockers:</strong> Look for similar options in your ad blocker's menu</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 25px; justify-content: center; flex-wrap: wrap;">
        <button id="force-disable-adblock-btn" style="
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          padding: 25px 50px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          font-size: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 12px 30px rgba(231, 76, 60, 0.5);
          border: 3px solid #fff;
        " onmouseover="this.style.transform='scale(1.15)'; this.style.boxShadow='0 18px 40px rgba(231, 76, 60, 0.7)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 12px 30px rgba(231, 76, 60, 0.5)'">
          🚫 FORCE DISABLE AD BLOCKER
        </button>
        <button id="force-refresh-page-btn" style="
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          border: none;
          padding: 25px 50px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          font-size: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 12px 30px rgba(52, 152, 219, 0.5);
          border: 3px solid #fff;
        " onmouseover="this.style.transform='scale(1.15)'; this.style.boxShadow='0 18px 40px rgba(52, 152, 219, 0.7)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 12px 30px rgba(52, 152, 219, 0.5)'">
          🔄 FORCE REFRESH PAGE
        </button>
        <button id="force-close-warning-btn" style="
          background: linear-gradient(45deg, #95a5a6, #7f8c8d);
          color: white;
          border: none;
          padding: 25px 50px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          font-size: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 12px 30px rgba(149, 165, 166, 0.5);
          border: 3px solid #fff;
        " onmouseover="this.style.transform='scale(1.15)'; this.style.boxShadow='0 18px 40px rgba(149, 165, 166, 0.7)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 12px 30px rgba(149, 165, 166, 0.5)'">
          ❌ CLOSE
        </button>
      </div>
      
      <p style="
        color: #888;
        font-size: 18px;
        margin: 40px 0 0 0;
        line-height: 1.7;
      ">
        💡 <strong>CRITICAL:</strong> We rely on ads to keep this service free. Thank you for your support!
      </p>
    `

    modal.appendChild(content)
    document.body.appendChild(modal)

    // Event listeners
    document.getElementById('force-disable-adblock-btn')?.addEventListener('click', () => {
      window.open('https://help.getadblock.com/support/solutions/articles/4000055640', '_blank')
    })

    document.getElementById('force-refresh-page-btn')?.addEventListener('click', () => {
      window.location.reload()
    })

    document.getElementById('force-close-warning-btn')?.addEventListener('click', () => {
      modal.remove()
      setShowModal(false)
    })

    // Auto-close after 180 seconds
    setTimeout(() => {
      if (document.body.contains(modal)) {
        modal.remove()
        setShowModal(false)
      }
    }, 180000)
  }

  useEffect(() => {
    // Immediate detection
    const immediateDetection = () => {
      console.log('🚀 IMMEDIATE FORCE DETECTION STARTING...')
      forceDetectAdblock()
    }

    // Run immediately
    immediateDetection()

    // Run again after a short delay
    const delayedDetection = setTimeout(() => {
      console.log('🔄 DELAYED FORCE DETECTION...')
      forceDetectAdblock()
    }, 500)

    // Set up aggressive periodic checking
    const interval = setInterval(() => {
      console.log('⏰ PERIODIC FORCE DETECTION...')
      forceDetectAdblock()
    }, 3000)

    return () => {
      clearTimeout(delayedDetection)
      clearInterval(interval)
      
      // Clean up modal on unmount
      const existingModal = document.getElementById('force-adblock-modal')
      if (existingModal) {
        existingModal.remove()
      }
    }
  }, [showWarning, customWarningMessage])

  return null
}
