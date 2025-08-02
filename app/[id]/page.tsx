"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Code, Eye, Calendar, User, Lock, Share2, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useHydration } from '@/hooks/use-hydration'
import { getPaste } from '@/hooks/use-paste'
import CopyIcon from '@/components/copy-icon'
import GoogleAdSense from '@/components/google-adsense'

export default function PastePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { isHydrated } = useHydration()
  const [isLoaded, setIsLoaded] = useState(false)
  
  const [paste, setPaste] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState('')
  
  // Timer states
  const [showTimer, setShowTimer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [timerActive, setTimerActive] = useState(false)

  const pasteId = params?.id as string

  useEffect(() => {
    const fetchPaste = async () => {
      if (!pasteId) return
      
      try {
        setLoading(true)
        const data = await getPaste(pasteId)
        
        if (data.success) {
          setPaste(data.paste)
          
          // Check if paste is password protected
          if (data.paste.isPasswordProtected && !data.paste.content) {
            setShowPasswordForm(true)
            setLoading(false)
            return
          }
          
          // Start timer for non-password protected pastes
          if (!data.paste.isPasswordProtected) {
            setShowTimer(true)
            setTimerActive(true)
          }
        } else {
          setError(data.error || 'Failed to load paste')
        }
      } catch (err) {
        setError('Failed to load paste')
      } finally {
        setLoading(false)
      }
    }

    if (pasteId) {
      fetchPaste()
    }
  }, [pasteId])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false)
            setShowTimer(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timeLeft])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const data = await getPaste(pasteId, password)
      
      if (data.success) {
        setPaste(data.paste)
        setShowPasswordForm(false)
        setShowTimer(true)
        setTimerActive(true)
      } else {
        setError(data.error || 'Invalid password')
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

  // Show loading state
  if (loading && !paste) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading paste...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Paste Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  // Show password form
  if (showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-400" />
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
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

  // Show timer with ads
  if (showTimer && timeLeft > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto p-6">
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl font-bold text-blue-400">{timeLeft}</div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Please Wait</h2>
              <p className="text-gray-400 mb-4">Content will be available in {timeLeft} seconds</p>
              <div className="w-full max-w-md mx-auto bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Loading content...</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((15 - timeLeft) / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Ad Display Area */}
            <div className="mb-8">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Sponsored Content</h3>
                <p className="text-sm text-gray-400">Please support our service</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 min-h-[300px] flex items-center justify-center">
                <GoogleAdSense />
              </div>
            </div>
            
            {/* Paste Preview */}
            {paste && (
              <div className="bg-gray-800/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Paste Preview</h3>
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-gray-400">
                      {paste.language || 'text'}
                    </span>
                  </div>
                </div>
                <div className="bg-black/50 rounded-lg p-4 max-h-40 overflow-hidden">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                    {paste.content?.substring(0, 200)}
                    {paste.content && paste.content.length > 200 && '...'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!paste) return null

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 ${isLoaded && isHydrated ? "animate-fade-in" : "opacity-0"}`}>
      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="w-px h-6 bg-gray-700 hidden sm:block"></div>
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-xs sm:text-sm text-gray-400">
                  {paste.language || 'text'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="bg-black/20 border-white/20 text-gray-300 hover:bg-gray-800"
              >
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
              <Button
                variant="outline"
                size="sm"
                onClick={copyUrl}
                className="bg-black/20 border-white/20 text-gray-300 hover:bg-gray-800"
              >
                <Share2 className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20 sm:pb-24">
        {/* Paste Info */}
        <div className="mb-6 sm:mb-8">
          {paste.title && (
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{paste.title}</h1>
          )}
          
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

        {/* Ad Display Area */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Sponsored Content</h3>
            <p className="text-sm text-gray-400">Please support our service</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6">
            <GoogleAdSense />
          </div>
        </div>

        {/* Paste Content */}
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute -inset-4 bg-gradient-to-br from-slate-900/15 via-gray-900/10 to-slate-800/15 rounded-3xl blur-3xl opacity-30"></div>
          <div className="absolute -top-6 -left-6 w-40 h-40 bg-gradient-radial from-purple-500/8 via-blue-500/4 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-radial from-blue-500/8 via-purple-500/4 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-radial from-blue-500/6 via-purple-500/3 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-radial from-purple-500/6 via-blue-500/3 to-transparent rounded-full blur-3xl opacity-60"></div>

          <div className="relative backdrop-blur-xl border border-white/5 rounded-3xl p-4 sm:p-8 shadow-2xl transition-all duration-300">
            <pre className="text-xs sm:text-sm text-white whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
              {paste.content}
            </pre>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-cyan-400" />
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
    </div>
  )
} 