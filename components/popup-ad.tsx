"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Lock, Download, CheckCircle, ArrowRight } from 'lucide-react'

interface PopupAdProps {
  trigger?: boolean
  onTriggered?: () => void
  taskUrl?: string
  pasteTitle?: string
}

export default function PopupAd({ trigger = false, onTriggered, taskUrl = "https://igk.filexspace.com/getfile/RELEGDD?title=Install", pasteTitle }: PopupAdProps) {
  const [taskStatus, setTaskStatus] = useState<'waiting' | 'loading' | 'completed'>('waiting')
  const [timeLeft, setTimeLeft] = useState(90)
  const [timerActive, setTimerActive] = useState(false)
  const [showUnlockButton, setShowUnlockButton] = useState(false)

  useEffect(() => {
    if (trigger) {
      setTaskStatus('waiting')
      setTimeLeft(90)
      setTimerActive(true)
      setShowUnlockButton(false)
    }
  }, [trigger])

  // Hidden timer effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false)
          setTaskStatus('completed')
          setShowUnlockButton(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const handleTaskClick = () => {
    setTaskStatus('loading')
    // Open the task URL in a new tab
    window.open(taskUrl, '_blank')
  }

  const handleUnlock = () => {
    if (onTriggered) {
      onTriggered()
    }
  }

  if (!trigger) return null

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-gray-900/90 border border-gray-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{pasteTitle || 'Premium Content'}</h2>
          <p className="text-gray-400 text-sm">Complete the following steps to access exclusive content</p>
        </div>

        {/* Task */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                taskStatus === 'completed' 
                  ? 'bg-green-500' 
                  : taskStatus === 'loading'
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-blue-500'
              }`}>
                {taskStatus === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : taskStatus === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Download and Install App</h3>
                <p className="text-gray-400 text-sm">Install the latest version of our app</p>
              </div>
            </div>
            {taskStatus === 'waiting' && (
              <button
                onClick={handleTaskClick}
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="border-t border-gray-700/50 pt-6 mb-8">
          <p className="text-white text-center font-medium">
            {taskStatus === 'completed' ? '1 of 1 tasks completed' : '0 of 1 tasks completed'}
          </p>
        </div>

        {/* Unlock Button */}
        <Button
          onClick={handleUnlock}
          disabled={!showUnlockButton}
          className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
            showUnlockButton
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {showUnlockButton ? 'Unlock Content' : 'Complete All Tasks to Unlock'}
        </Button>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Powered by <span className="text-blue-400 font-medium">SharkVault</span>
          </p>
        </div>
      </div>
    </div>
  )
}
