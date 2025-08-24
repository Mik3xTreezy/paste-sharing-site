"use client"

import { useEffect } from 'react'

export default function AdTestElements() {
  useEffect(() => {
    // Create test ad elements that ad blockers typically block
    const testElements = [
      {
        id: 'adsbox',
        className: 'adsbox',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'advertisement',
        className: 'advertisement',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'ads',
        className: 'ads',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'ad',
        className: 'ad',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'adsbygoogle',
        className: 'adsbygoogle',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'google-ad',
        className: 'google-ad',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'doubleclick',
        className: 'doubleclick',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'banner-ad',
        className: 'banner-ad',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      // Additional aggressive test elements
      {
        id: 'ad-container',
        className: 'ad-container',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'ad-wrapper',
        className: 'ad-wrapper',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'ad-unit',
        className: 'ad-unit',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'ad-space',
        className: 'ad-space',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'ad-slot',
        className: 'ad-slot',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'ad-banner',
        className: 'ad-banner',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'ad-sidebar',
        className: 'ad-sidebar',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'ad-header',
        className: 'ad-header',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      },
      {
        id: 'ad-footer',
        className: 'ad-footer',
        style: 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;',
        content: '&nbsp;'
      }
    ]

    // Add test elements to the page
    testElements.forEach(element => {
      const div = document.createElement('div')
      div.id = element.id
      div.className = element.className
      div.style.cssText = element.style
      div.innerHTML = element.content
      document.body.appendChild(div)
    })

    // Add test scripts that ad blockers typically block
    const testScripts = [
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      'https://www.googletagmanager.com/gtag/js',
      'https://www.google-analytics.com/analytics.js',
      'https://www.googleadservices.com/pagead/conversion.js'
    ]

    testScripts.forEach(src => {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.style.display = 'none'
      document.head.appendChild(script)
    })

    // Cleanup function
    return () => {
      // Remove test elements
      testElements.forEach(element => {
        const el = document.getElementById(element.id)
        if (el) {
          el.remove()
        }
      })

      // Remove test scripts
      testScripts.forEach(src => {
        const script = document.querySelector(`script[src="${src}"]`)
        if (script) {
          script.remove()
        }
      })
    }
  }, [])

  return null
}
