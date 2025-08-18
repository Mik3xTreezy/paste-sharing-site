"use client"

import ForceAdblockDetector from './force-adblock-detector'
import AdTestElements from './ad-test-elements'

export default function AntiAdblockWrapper() {
  return (
    <>
      <AdTestElements />
      <ForceAdblockDetector 
        onAdblockDetected={() => {
          console.log('🚫 FORCE AD BLOCKER DETECTED! - user experience may be affected')
        }}
        onAdblockNotDetected={() => {
          console.log('✅ FORCE: No ad blocker detected - full functionality available')
        }}
        showWarning={true}
        forceDetection={true}
        customWarningMessage="🚫 FORCE DETECTION: AD BLOCKER DETECTED! We've detected that you're using an ad blocker (uBlock Origin). Our paste sharing service relies on advertising to remain free and accessible to everyone. Please disable your ad blocker for this site to continue using our services."
      />
    </>
  )
}
