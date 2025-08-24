"use client"

import { useEffect, useRef } from 'react'

interface PopupAdProps {
  trigger?: boolean
  onTriggered?: () => void
}

export default function PopupAd({ trigger = false, onTriggered }: PopupAdProps) {
  // Popup ad disabled - component does nothing
  return null
}
