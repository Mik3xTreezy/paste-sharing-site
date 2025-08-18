"use client"

import AntiAdblockAdvanced from './anti-adblock-advanced'

export default function AntiAdblockWrapper() {
  return (
    <AntiAdblockAdvanced 
      onAdblockDetected={() => {
        console.log('Ad blocker detected - user experience may be affected')
      }}
      onAdblockNotDetected={() => {
        console.log('No ad blocker detected - full functionality available')
      }}
      showWarning={true}
      customWarningMessage="We've detected that you're using an ad blocker. Our paste sharing service relies on advertising to remain free and accessible to everyone. Please disable your ad blocker for this site to continue using our services."
    />
  )
}
