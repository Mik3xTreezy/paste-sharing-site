"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Code, Eye, Calendar, User, Lock, Share2, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { getPaste } from '@/hooks/use-paste'
import CopyIcon from '@/components/copy-icon'
import PopupAd from '@/components/popup-ad'
import CounterSuspiciousAd from '@/components/counter-suspicious-ad'


interface PastePageClientProps {
  initialPaste: any
}

export default function PastePageClient({ initialPaste }: PastePageClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoaded, setIsLoaded] = useState(false)
  
  const [paste, setPaste] = useState<any>(initialPaste)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState('')
  
  // Task mode states
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskButtonClicked, setTaskButtonClicked] = useState(false)
  
  // Popup ad states
  const [showPopupAd, setShowPopupAd] = useState(false)

  // View tracking state
  const [viewTracked, setViewTracked] = useState(false)

  const pasteId = paste?.id

  useEffect(() => {
    // Show task modal for all pastes (password-protected ones will show after password is entered)
    if (paste && !paste.isPassword) {
      setShowTaskModal(true)
    }
    setIsLoaded(true)
  }, [paste])

  // Track view when paste content is actually displayed (not in password form or task modal)
  useEffect(() => {
    const trackView = async () => {
      // Only track if:
      // 1. Paste exists
      // 2. Not showing password form
      // 3. Not showing task modal (paste is unlocked)
      // 4. Haven't tracked view yet
      if (
        pasteId &&
        !showPasswordForm &&
        !showTaskModal &&
        !viewTracked &&
        paste
      ) {
        try {
          const response = await fetch(`/api/pastes/${pasteId}/view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.views !== undefined) {
              // Update the view count in state
              setPaste((prev: any) => ({
                ...prev,
                views: data.views,
              }))
              setViewTracked(true)
            }
          }
        } catch (error) {
          console.error('Error tracking view:', error)
          // Don't show error to user, just log it
        }
      }
    }

    trackView()
  }, [pasteId, showPasswordForm, showTaskModal, viewTracked, paste])

  // Inject ad script into head when task modal is shown (covers task modal, waiting, and unlock pages)
  useEffect(() => {
    if (showTaskModal) {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="capriceawelessaweless.com"]')
      if (existingScript) {
        return
      }

      // Create and inject the script into head
      const script = document.createElement('script')
      script.src = 'https://capriceawelessaweless.com/a1/13/07/a113078fb08efadf0594c1e8d2e2a8d2.js'
      script.async = false
      script.defer = false
      
      // Append to head
      document.head.appendChild(script)
    }
  }, [showTaskModal])




  // Load banner ad when component mounts
  useEffect(() => {
    const loadBannerAd = (containerId: string) => {
      const container = document.getElementById(containerId)
      if (container) {
        // Create the options script
        const optionsScript = document.createElement('script')
        optionsScript.type = 'text/javascript'
        optionsScript.innerHTML = `
          atOptions = {
            'key' : 'cc902bc9e7460ee4307f2cc068b1cdf7',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
          };
        `
        
        // Create the ad script
        const adScript = document.createElement('script')
        adScript.type = 'text/javascript'
        adScript.src = '//countersuspiciousdiverse.com/cc902bc9e7460ee4307f2cc068b1cdf7/invoke.js'
        
        // Clear container and add scripts
        container.innerHTML = ''
        container.appendChild(optionsScript)
        container.appendChild(adScript)
      }
    }
    
    if (isLoaded && !showPasswordForm && !showTaskModal) {
      // Load banner ad in main content section
      setTimeout(() => loadBannerAd('banner-ad-container'), 500)
    }
  }, [isLoaded, showPasswordForm, showTaskModal])



  const handleTaskUrlClick = () => {
    // First click: open link in new tab
    if (!taskButtonClicked) {
      setTaskButtonClicked(true)
      window.open('https://capriceawelessaweless.com/i29eb4a5r?key=c61cc36917b032be8ea43b304e2db396', '_blank')
      return
    }
    
    // Second click: inject ad script and unlock paste
    const existingScript = document.querySelector('script[src*="capriceawelessaweless.com"]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://capriceawelessaweless.com/a1/13/07/a113078fb08efadf0594c1e8d2e2a8d2.js'
      document.head.appendChild(script)
    }
    
    // Unlock paste content directly
    setShowTaskModal(false)
    // Reset view tracking so it tracks when content is shown
    setViewTracked(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const paste = await getPaste(pasteId, password)
      
      if (paste) {
        setPaste(paste)
        setShowPasswordForm(false)
        setShowTaskModal(true)
        // Reset view tracking so it tracks after task modal is dismissed
        setViewTracked(false)
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('Failed to verify password')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!paste?.content) return
    
    try {
      await navigator.clipboard.writeText(paste.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${pasteId}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Show password form
  if (showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Password Protected</h2>
              <p className="text-gray-400">This paste is password protected</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
              <Button
                type="submit"
                className="w-full btn-gradient-primary"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Access Paste'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (showTaskModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="max-w-4xl w-full mx-auto p-6">
            {/* Ad Banner in Header */}
            <div className="mb-4">
              <CounterSuspiciousAd />
            </div>
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Click below to View Paste</h2>
              <p className="text-gray-400 mb-6">
                Click the button below to view the paste content
              </p>
              <Button
                onClick={handleTaskUrlClick}
                className="btn-gradient-primary px-8 py-3 text-lg font-semibold"
              >
                View Paste
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!paste) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading paste...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="w-px h-6 bg-gray-700 hidden sm:block"></div>
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-blue-500" />
                <span className="text-xs sm:text-sm text-gray-400">{paste.language || 'text'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3"></div>
          </div>
        </div>
        {/* Ad in Header */}
        <div className="w-full py-2">
          <CounterSuspiciousAd />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20 sm:pb-24">
        {/* Paste Info */}
        <div className="mb-6 sm:mb-8">
          {paste.title && <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{paste.title}</h1>}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs sm:text-sm">{formatDate(paste.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span className="text-xs sm:text-sm">{paste.views} views</span>
            </div>
            {paste.user && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-xs sm:text-sm">{paste.user.name || paste.user.username || 'Anonymous'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Paste Content */}
        <div className="relative mb-8">
          {/* Background Effects */}
          <div className="absolute -inset-4 bg-gradient-to-br from-slate-900/15 via-gray-900/10 to-slate-800/15 rounded-3xl blur-3xl opacity-30"></div>
          <div className="absolute -top-6 -left-6 w-40 h-40 bg-gradient-radial from-purple-500/8 via-blue-500/4 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-radial from-blue-500/8 via-purple-500/4 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-radial from-blue-500/6 via-purple-500/3 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-radial from-purple-500/6 via-blue-500/3 to-transparent rounded-full blur-3xl opacity-60"></div>

          <div className="relative glass-card-strong rounded-3xl p-4 sm:p-8 transition-all duration-300">
            <pre className="text-xs sm:text-sm text-white whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
              {paste.content}
            </pre>

            {/* Action Bar - Copy and Share buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/5 space-y-4 sm:space-y-0">
              <div className="flex items-center justify-center sm:justify-start space-x-4 sm:space-x-8"></div>

              <div className="flex items-center justify-center sm:justify-end space-x-3">
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="btn-gradient-secondary">
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon size={16} className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={copyUrl} className="btn-gradient-secondary">
                  <Share2 className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </div>
                 </div>

         {/* Banner Ad */}
         <div className="relative mb-8">
           <div className="flex items-center justify-center">
             <div 
               id="banner-ad-container"
               className="w-full max-w-[468px] h-[60px] flex items-center justify-center bg-gray-800/20 rounded-lg border border-white/5"
             />
           </div>
         </div>

       </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-400">PasteScript</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>© 2024 PasteScript</span>
              <span>•</span>
              <span>Share code instantly</span>
            </div>
          </div>
        </div>
      </footer>


      {/* Popup Ad Component */}
      <PopupAd trigger={showPopupAd} onTriggered={() => setTimeout(() => setShowPopupAd(false), 100)} />
    </div>
  )
}