"use client"

import { useEffect, useState } from 'react'
import { detectAdBlocker } from '@scthakuri/adblock-detector'

interface AntiAdblockDetectorProps {
  onAdblockDetected?: () => void
  onAdblockNotDetected?: () => void
  showWarning?: boolean
  customWarningMessage?: string
  checkInterval?: number
}

export default function AntiAdblockDetector({ 
  onAdblockDetected, 
  onAdblockNotDetected, 
  showWarning = true,
  customWarningMessage,
  checkInterval = 5000
}: AntiAdblockDetectorProps) {
  const [isAdblockDetected, setIsAdblockDetected] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const detectAdblock = async () => {
    try {
      const isBlocked = await detectAdBlocker()
      
      if (isBlocked) {
        console.log('Ad blocker detected using @scthakuri/adblock-detector')
        setIsAdblockDetected(true)
        onAdblockDetected?.()
        
        if (showWarning && !showModal) {
          setShowModal(true)
          showAdblockWarning()
        }
      } else {
        console.log('No ad blocker detected using @scthakuri/adblock-detector')
        setIsAdblockDetected(false)
        onAdblockNotDetected?.()
      }
    } catch (error) {
      console.error('Error detecting ad blocker:', error)
    }
  }

  const showAdblockWarning = () => {
    // Remove any existing modal first
    const existingModal = document.getElementById('adblock-detector-modal')
    if (existingModal) {
      existingModal.remove()
    }

    const modal = document.createElement('div')
    modal.id = 'adblock-detector-modal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      backdrop-filter: blur(10px);
    `

    const content = document.createElement('div')
    content.style.cssText = `
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 40px;
      border-radius: 20px;
      max-width: 600px;
      text-align: center;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
      border: 1px solid #333;
      color: white;
      animation: slideIn 0.3s ease-out;
    `

    // Add CSS animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `
    document.head.appendChild(style)

    const message = customWarningMessage || 
      "We've detected that you're using an ad blocker. Our paste sharing service relies on advertising to remain free and accessible to everyone. Please disable your ad blocker for this site to continue using our services."

    content.innerHTML = `
      <div style="margin-bottom: 30px;">
        <div style="
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
          font-size: 50px;
          animation: pulse 2s infinite;
          box-shadow: 0 10px 30px rgba(231, 76, 60, 0.3);
        ">⚠️</div>
        <h2 style="
          color: #e74c3c;
          margin: 0 0 20px 0;
          font-size: 32px;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        ">Ad Blocker Detected</h2>
        <p style="
          color: #ccc;
          line-height: 1.7;
          margin: 0 0 30px 0;
          font-size: 18px;
        ">${message}</p>
      </div>
      
      <div style="
        background: rgba(255, 255, 255, 0.1);
        padding: 25px;
        border-radius: 15px;
        margin-bottom: 30px;
        text-align: left;
        border: 1px solid rgba(255, 255, 255, 0.1);
      ">
        <h3 style="
          color: #fff;
          margin: 0 0 20px 0;
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        ">
          <span style="font-size: 24px;">🔧</span>
          How to disable your ad blocker:
        </h3>
        <ul style="
          color: #ccc;
          margin: 0;
          padding-left: 25px;
          line-height: 2;
          font-size: 16px;
        ">
          <li><strong>uBlock Origin:</strong> Click the uBlock icon → "Pause uBlock" or "Allow ads on this site"</li>
          <li><strong>AdBlock:</strong> Click the AdBlock icon → "Don't run on pages on this domain"</li>
          <li><strong>AdBlock Plus:</strong> Click the ABP icon → "Disable on this site"</li>
          <li><strong>Other blockers:</strong> Look for similar options in your ad blocker's menu</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <button id="disable-adblock-btn" style="
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          padding: 18px 35px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
        " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 25px rgba(231, 76, 60, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 5px 15px rgba(231, 76, 60, 0.3)'">
          🚫 Disable Ad Blocker
        </button>
        <button id="refresh-page-btn" style="
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          border: none;
          padding: 18px 35px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 25px rgba(52, 152, 219, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 5px 15px rgba(52, 152, 219, 0.3)'">
          🔄 Refresh Page
        </button>
        <button id="close-warning-btn" style="
          background: linear-gradient(45deg, #95a5a6, #7f8c8d);
          color: white;
          border: none;
          padding: 18px 35px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(149, 165, 166, 0.3);
        " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 25px rgba(149, 165, 166, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 5px 15px rgba(149, 165, 166, 0.3)'">
          ❌ Close
        </button>
      </div>
      
      <p style="
        color: #888;
        font-size: 14px;
        margin: 25px 0 0 0;
        line-height: 1.5;
      ">
        💡 <strong>Tip:</strong> We rely on ads to keep this service free. Thank you for your support!
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

    // Auto-close after 90 seconds
    setTimeout(() => {
      if (document.body.contains(modal)) {
        modal.remove()
        setShowModal(false)
      }
    }, 90000)
  }

  useEffect(() => {
    // Initial detection
    detectAdblock()

    // Set up periodic checking
    const interval = setInterval(() => {
      detectAdblock()
    }, checkInterval)

    return () => {
      clearInterval(interval)
      
      // Clean up modal on unmount
      const existingModal = document.getElementById('adblock-detector-modal')
      if (existingModal) {
        existingModal.remove()
      }
    }
  }, [checkInterval, showWarning, customWarningMessage])

  return null
}
