"use client"

import { useEffect, useRef } from 'react'

interface CopyIconProps {
  className?: string
  size?: number
}

export default function CopyIcon({ className = "", size = 16 }: CopyIconProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      // Dynamically import Lottie
      import('lottie-web').then((Lottie) => {
        const animation = Lottie.default.loadAnimation({
          container: containerRef.current!,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: {
            "v": "5.12.1",
            "fr": 60,
            "ip": 0,
            "op": 60,
            "w": 500,
            "h": 500,
            "nm": "system-regular-99-copy",
            "ddd": 0,
            "assets": [{
              "id": "comp_1",
              "nm": "hover-copy",
              "fr": 60,
              "layers": [{
                "ddd": 0,
                "ind": 1,
                "ty": 4,
                "nm": ".primary.design",
                "cl": "primary design",
                "sr": 1,
                "ks": {
                  "o": {"a": 0, "k": 100, "ix": 11},
                  "r": {"a": 0, "k": 0, "ix": 10},
                  "p": {"a": 0, "k": [250, 250.097, 0], "ix": 2, "l": 2},
                  "a": {"a": 0, "k": [250, 250.097, 0], "ix": 1, "l": 2},
                  "s": {"a": 0, "k": [100, 100, 100], "ix": 6, "l": 2}
                },
                "ao": 0,
                "shapes": [{
                  "ty": "gr",
                  "it": [{
                    "ind": 0,
                    "ty": "sh",
                    "ix": 1,
                    "ks": {
                      "a": 0,
                      "k": {
                        "i": [[8.644, 0], [0, 0], [0, 2.81], [0, 0], [8.644, 0], [0, -8.643], [0, 0], [-20.117, 0], [0, 0], [0, 8.643]],
                        "o": [[0, 0], [-2.81, 0], [0, 0], [0, -8.643], [-8.644, 0], [0, 0], [0, 20.117], [0, 0], [8.644, 0], [0, -8.643]],
                        "v": [[23.438, 7.788], [-2.604, 7.788], [-7.787, 2.604], [-7.787, -23.438], [-23.438, -39.087], [-39.088, -23.438], [-39.088, 2.604], [-2.604, 39.087], [23.438, 39.087], [39.088, 23.438]],
                        "c": true
                      },
                      "ix": 2
                    },
                    "nm": "Path 1",
                    "mn": "ADBE Vector Shape - Group",
                    "hd": false
                  }, {
                    "ty": "fl",
                    "c": {"a": 0, "k": [0.071, 0.075, 0.192, 1], "ix": 4},
                    "o": {"a": 0, "k": 100, "ix": 5},
                    "r": 1,
                    "bm": 0,
                    "nm": ".primary",
                    "mn": "ADBE Vector Graphic - Fill",
                    "hd": false,
                    "cl": "primary"
                  }, {
                    "ty": "tr",
                    "p": {"a": 0, "k": [101.565, 294.274], "ix": 2},
                    "a": {"a": 0, "k": [0, 0], "ix": 1},
                    "s": {"a": 0, "k": [100, 100], "ix": 3},
                    "r": {"a": 0, "k": 0, "ix": 6},
                    "o": {"a": 0, "k": 100, "ix": 7},
                    "sk": {"a": 0, "k": 0, "ix": 4},
                    "sa": {"a": 0, "k": 0, "ix": 5},
                    "nm": "Transform"
                  }],
                  "nm": "Group 1",
                  "np": 2,
                  "cix": 2,
                  "bm": 0,
                  "ix": 1,
                  "mn": "ADBE Vector Group",
                  "hd": false
                }],
                "ip": 60,
                "op": 300,
                "st": 0,
                "ct": 1,
                "bm": 0
              }],
              "ip": 0,
              "op": 1,
              "st": 0,
              "ct": 1,
              "bm": 0
            }],
            "layers": [{
              "ddd": 0,
              "ind": 1,
              "ty": 3,
              "nm": "control",
              "sr": 1,
              "ks": {
                "o": {"a": 0, "k": 0, "ix": 11},
                "r": {"a": 0, "k": 0, "ix": 10},
                "p": {"a": 0, "k": [0, 0], "ix": 2, "l": 2},
                "a": {"a": 0, "k": [0, 0, 0], "ix": 1, "l": 2},
                "s": {"a": 0, "k": [100, 100, 100], "ix": 6, "l": 2}
              },
              "ao": 0,
              "ef": [{
                "ty": 5,
                "nm": "primary",
                "np": 3,
                "mn": "ADBE Color Control",
                "ix": 1,
                "en": 1,
                "ef": [{
                  "ty": 2,
                  "nm": "Color",
                  "mn": "ADBE Color Control-0001",
                  "ix": 1,
                  "v": {"a": 0, "k": [0.071, 0.075, 0.192], "ix": 1}
                }]
              }],
              "ip": 0,
              "op": 131,
              "st": 0,
              "bm": 0
            }, {
              "ddd": 0,
              "ind": 3,
              "ty": 0,
              "nm": "hover-copy",
              "refId": "comp_1",
              "sr": 1,
              "ks": {
                "o": {"a": 0, "k": 100, "ix": 11},
                "r": {"a": 0, "k": 0, "ix": 10},
                "p": {"a": 0, "k": [250, 250, 0], "ix": 2, "l": 2},
                "a": {"a": 0, "k": [250, 250, 0], "ix": 1, "l": 2},
                "s": {"a": 0, "k": [100, 100, 100], "ix": 6, "l": 2}
              },
              "ao": 0,
              "w": 500,
              "h": 500,
              "ip": 0,
              "op": 70,
              "st": 0,
              "bm": 0
            }],
            "markers": [{"tm": 0, "cm": "default:hover-copy", "dr": 60}],
            "props": {}
          }
        })

        // Play animation on hover
        const container = containerRef.current
        container.addEventListener('mouseenter', () => {
          animation.play()
        })

        container.addEventListener('mouseleave', () => {
          animation.goToAndStop(0, true)
        })

        return () => {
          animation.destroy()
        }
      }).catch((error) => {
        console.error('Failed to load Lottie:', error)
      })
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ width: size, height: size }}
    />
  )
} 