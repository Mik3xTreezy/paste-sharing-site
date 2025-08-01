"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Eye, 
  Lock, 
  Copy, 
  Share2, 
  Code, 
  ArrowLeft, 
  Calendar,
  Clock,
  User,
  ExternalLink,
  CheckCircle
} from "lucide-react"
import { usePaste } from "@/hooks/use-paste"
import { Paste } from "@/hooks/use-paste"
import { useHydration } from "@/hooks/use-hydration"

export default function PastePage() {
  const params = useParams()
  const router = useRouter()
  const { getPaste, loading, error } = usePaste()
  const [paste, setPaste] = useState<Paste | null>(null)
  const [password, setPassword] = useState("")
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const isHydrated = useHydration()

  const pasteId = params.id as string

  useEffect(() => {
    const fetchPaste = async () => {
      const result = await getPaste(pasteId)
      if (result) {
        setPaste(result)
        setIsLoaded(true)
      } else if (error === 'Password required') {
        setShowPasswordForm(true)
      }
    }

    if (pasteId) {
      fetchPaste()
    }
  }, [pasteId]) // Remove getPaste and error from dependencies

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await getPaste(pasteId, password)
    if (result) {
      setPaste(result)
      setShowPasswordForm(false)
      setIsLoaded(true)
    }
  }

  const copyToClipboard = async () => {
    if (paste?.content) {
      await navigator.clipboard.writeText(paste.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyUrl = async () => {
    const url = `${window.location.origin}/paste/${pasteId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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

  if (!paste) return null

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 ${isLoaded && isHydrated ? "animate-fade-in" : "opacity-0"}`}>
      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="w-px h-6 bg-gray-700"></div>
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-400">
                  {paste.language || 'text'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="bg-black/20 border-white/20 text-gray-300 hover:bg-gray-800"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyUrl}
                className="bg-black/20 border-white/20 text-gray-300 hover:bg-gray-800"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Paste Info */}
        <div className="mb-8">
          {paste.title && (
            <h1 className="text-3xl font-bold text-white mb-4">{paste.title}</h1>
          )}
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(paste.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{paste.views} views</span>
            </div>
            {paste.user && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{paste.user.name || paste.user.username || 'Anonymous'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-slate-900/15 via-gray-900/10 to-slate-800/15 rounded-3xl blur-3xl opacity-30"></div>
          
          <div className="relative backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
            <pre className="text-white text-sm leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto">
              <code>{paste.content}</code>
            </pre>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{paste.content.length}</div>
              <div className="text-sm text-gray-400">Characters</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{paste.content.split('\n').length}</div>
              <div className="text-sm text-gray-400">Lines</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{paste.content.split(' ').filter(w => w.length > 0).length}</div>
              <div className="text-sm text-gray-400">Words</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{paste.views}</div>
              <div className="text-sm text-gray-400">Views</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 