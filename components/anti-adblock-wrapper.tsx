"use client"

import AggressiveAdblockDetector from './aggressive-adblock-detector'
import AdTestElements from './ad-test-elements'

export default function AntiAdblockWrapper() {
  return (
    <>
      <AdTestElements />
      <AggressiveAdblockDetector 
        onAdblockDetected={() => {
          console.log('🚫 AGGRESSIVE AD BLOCKER DETECTED! - user experience may be affected')
        }}
        onAdblockNotDetected={() => {
          console.log('✅ No ad blocker detected - full functionality available')
        }}
        showWarning={true}
        checkInterval={2000}
        customWarningMessage="🚫 AD BLOCKER DETECTED! We've detected that you're using an ad blocker (likely uBlock Origin). Our paste sharing service relies on advertising to remain free and accessible to everyone. Please disable your ad blocker for this site to continue using our services."
      />
    </>
  )
}
