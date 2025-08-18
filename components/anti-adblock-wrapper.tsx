"use client"

import AntiAdblockDetector from './anti-adblock-detector'
import AdTestElements from './ad-test-elements'

export default function AntiAdblockWrapper() {
  return (
    <>
      <AdTestElements />
      <AntiAdblockDetector 
        onAdblockDetected={() => {
          console.log('Ad blocker detected using @scthakuri/adblock-detector - user experience may be affected')
        }}
        onAdblockNotDetected={() => {
          console.log('No ad blocker detected using @scthakuri/adblock-detector - full functionality available')
        }}
        showWarning={true}
        checkInterval={3000}
        customWarningMessage="We've detected that you're using an ad blocker. Our paste sharing service relies on advertising to remain free and accessible to everyone. Please disable your ad blocker for this site to continue using our services."
      />
    </>
  )
}
