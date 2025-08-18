import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import AuthProvider from "@/components/session-provider"
import AntiAdblockWrapper from "@/components/anti-adblock-wrapper"

const geist = GeistSans

export const metadata: Metadata = {
  title: "PasteScript - Modern Paste Sharing Platform",
  description: "A beautiful, modern paste sharing application for code, text, and more",
  generator: 'v0.dev',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-228Y2037BZ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-228Y2037BZ');
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force Adblock Detection Script
              (function() {
                console.log('🚀 FORCE ADBLOCK DETECTION SCRIPT LOADED');
                
                function forceDetectAdblock() {
                  console.log('🔍 FORCE DETECTING AD BLOCKER...');
                  
                  let detectionScore = 0;
                  const maxScore = 100;
                  
                  // Test 1: Create test ad element
                  try {
                    const testDiv = document.createElement('div');
                    testDiv.id = 'force-ad-test-script';
                    testDiv.className = 'adsbox advertisement ads ad adsbygoogle google-ad doubleclick banner-ad';
                    testDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:100px;height:100px;background:red;z-index:999999;';
                    testDiv.innerHTML = '<div style="width:100%;height:100%;background:blue;">AD TEST</div>';
                    
                    document.body.appendChild(testDiv);
                    
                    setTimeout(() => {
                      const element = document.getElementById('force-ad-test-script');
                      if (!element || element.offsetHeight === 0 || element.offsetWidth === 0) {
                        detectionScore += 30;
                        console.log('🚫 FORCE SCRIPT: Ad element blocked (30 points)');
                      } else {
                        console.log('✅ FORCE SCRIPT: Ad element visible');
                      }
                      
                      if (element) {
                        element.remove();
                      }
                    }, 100);
                  } catch (error) {
                    detectionScore += 20;
                    console.log('🚫 FORCE SCRIPT: Error creating test element (20 points)');
                  }
                  
                  // Test 2: Check for missing functions
                  const missingFunctions = ['adsbygoogle', 'ga', 'gtag', 'fbq', 'dataLayer'];
                  missingFunctions.forEach(funcName => {
                    if (typeof window[funcName] === 'undefined') {
                      detectionScore += 8;
                      console.log('🚫 FORCE SCRIPT: Function missing: ' + funcName + ' (8 points)');
                    }
                  });
                  
                  // Test 3: Check for uBlock patterns
                  const uBlockPatterns = ['ublock', 'adblock', 'adblockplus', 'ghostery', 'privacy-badger'];
                  uBlockPatterns.forEach(pattern => {
                    if (document.querySelector('[class*="' + pattern + '"]') || 
                        document.querySelector('[id*="' + pattern + '"]') ||
                        window[pattern]) {
                      detectionScore += 15;
                      console.log('🚫 FORCE SCRIPT: uBlock pattern: ' + pattern + ' (15 points)');
                    }
                  });
                  
                  console.log('🎯 FORCE SCRIPT DETECTION SCORE: ' + detectionScore + '/' + maxScore);
                  
                  if (detectionScore >= 40) {
                    console.log('🚫 FORCE SCRIPT: AD BLOCKER DETECTED!');
                    
                    // Show warning modal
                    const modal = document.createElement('div');
                    modal.id = 'force-script-modal';
                    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.99);z-index:9999999;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;';
                    
                                         modal.innerHTML = \`
                       <div style="background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);padding:25px;border-radius:15px;max-width:450px;text-align:center;box-shadow:0 15px 50px rgba(0,0,0,0.8);border:2px solid #e74c3c;color:white;">
                         <div style="width:60px;height:60px;background:linear-gradient(45deg,#e74c3c,#c0392b);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 15px;font-size:30px;animation:pulse 2s infinite;">🚫</div>
                         <h2 style="color:#e74c3c;margin:0 0 15px 0;font-size:20px;font-weight:bold;">🚫 AD BLOCKER DETECTED!</h2>
                         <p style="color:#ccc;line-height:1.5;margin:0 0 20px 0;font-size:14px;">We've detected that you're using an ad blocker (uBlock Origin). Please disable it to continue.</p>
                         <div style="background:rgba(231,76,60,0.1);padding:15px;border-radius:10px;margin-bottom:20px;text-align:left;border:1px solid rgba(231,76,60,0.3);">
                           <h3 style="color:#e74c3c;margin:0 0 10px 0;font-size:16px;">🔧 How to disable:</h3>
                           <ul style="color:#ccc;margin:0;padding-left:15px;line-height:1.6;font-size:12px;">
                             <li><strong style="color:#e74c3c;">uBlock Origin:</strong> Click the red "u" icon → "Pause uBlock" or "Allow ads on this site"</li>
                             <li><strong style="color:#e74c3c;">AdBlock:</strong> Click the AdBlock icon → "Don't run on pages on this domain"</li>
                           </ul>
                         </div>
                         <div style="display:flex;gap:10px;justify-content:center;">
                           <button onclick="window.location.reload()" style="background:linear-gradient(45deg,#e74c3c,#c0392b);color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:12px;">🔄 REFRESH</button>
                           <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background:linear-gradient(45deg,#95a5a6,#7f8c8d);color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:12px;">❌ CLOSE</button>
                         </div>
                       </div>
                     \`;
                    
                    document.body.appendChild(modal);
                    
                    // Auto-close after 120 seconds
                    setTimeout(() => {
                      if (document.body.contains(modal)) {
                        modal.remove();
                      }
                    }, 120000);
                  } else {
                    console.log('✅ FORCE SCRIPT: No ad blocker detected');
                  }
                }
                
                // Run detection immediately
                forceDetectAdblock();
                
                // Run again after delay
                setTimeout(forceDetectAdblock, 1000);
                
                // Run periodically
                setInterval(forceDetectAdblock, 5000);
              })();
            `,
          }}
        />
      </head>
      <body className={geist.className} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <AntiAdblockWrapper />
      </body>
    </html>
  )
}
