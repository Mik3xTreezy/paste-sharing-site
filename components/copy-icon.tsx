"use client"

import { useState } from 'react'

interface CopyIconProps {
  className?: string
  size?: number
}

export default function CopyIcon({ className = "", size = 16 }: CopyIconProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-200 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main copy icon */}
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        ry="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className={`transition-all duration-200 ${isHovered ? 'scale-110' : 'scale-100'}`}
      />
      
      {/* Document icon */}
      <path
        d="M16 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className={`transition-all duration-200 ${isHovered ? 'translate-x-1 translate-y-1' : 'translate-x-0 translate-y-0'}`}
      />
      
      {/* Checkmark (appears on hover) */}
      {isHovered && (
        <path
          d="M20 6l-3 3-1-1"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
        />
      )}
    </svg>
  )
} 