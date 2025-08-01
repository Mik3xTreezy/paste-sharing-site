"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Lock, Copy, Share2, Sparkles, Code, CheckCircle, AlertCircle, User, LogOut } from "lucide-react"
import { usePaste } from "@/hooks/use-paste"
import { useRouter } from "next/navigation"
import { useHydration } from "@/hooks/use-hydration"
import { useSession, signOut } from "next-auth/react"

export default function HomePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [createdPasteId, setCreatedPasteId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const { createPaste, loading, error } = usePaste()
  const isHydrated = useHydration()
  const { data: session } = useSession()

  const handleCreatePaste = async () => {
    if (!content.trim()) return

    const paste = await createPaste({
      title: title.trim() || undefined,
      content: content.trim(),
      isPublic,
      isPassword: false,
      userId: session?.user?.id,
    })

    if (paste) {
      setShowSuccess(true)
      setCreatedPasteId(paste.id)
      
      // Copy link to clipboard
      const pasteUrl = `${window.location.origin}/${paste.id}`
      await navigator.clipboard.writeText(pasteUrl)
      
      // Show notification
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    }
  }

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  // Page load animation
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 ${isLoaded && isHydrated ? "animate-fade-in" : "opacity-0"}`}
    >
      {/* Header */}
      <header
        className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm animate-fade-in-up"
        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative micro-scale">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-pink-500 p-0.5">
                  <div className="w-full h-full bg-black rounded-md flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                PasteScript
              </h1>
            </div>
            <nav className="hidden sm:flex items-center space-x-6">
              <a href="/browse" className="text-gray-400 hover:text-white transition-colors text-sm font-normal nav-link">
                Browse
              </a>
              {session && (
                <a href="/my-pastes" className="text-gray-400 hover:text-white transition-colors text-sm font-normal nav-link">
                  My Pastes
                </a>
              )}
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-normal nav-link">
                Recent
              </a>
              {session ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <span className="text-sm hidden md:inline">{session.user?.name || session.user?.username}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="bg-black/20 backdrop-blur-sm border-white/20 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent font-normal micro-scale"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/auth/signin')}
                  className="bg-black/20 backdrop-blur-sm border-white/20 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent font-normal micro-scale"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              )}
            </nav>
            {/* Mobile menu button */}
            <div className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/auth/signin')}
                className="bg-black/20 backdrop-blur-sm border-white/20 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent font-normal micro-scale"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Title Section */}
        <div
          className="text-center mb-8 sm:mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white relative inline-block tracking-wide">
            Create{" "}
            <span className="text-white relative">
              Paste
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"></div>
            </span>
          </h2>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.25s", animationFillMode: "both" }}>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Unified Input Container */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
          {/* Ultra-soft gradient shadow */}
          <div className="absolute -inset-8 bg-gradient-to-br from-slate-900/15 via-gray-900/10 to-slate-800/15 rounded-3xl blur-3xl opacity-30"></div>

          {/* Enhanced ambient corner glows with purple-blue tint */}
          <div className="absolute -top-6 -left-6 w-40 h-40 bg-gradient-radial from-purple-500/8 via-blue-500/4 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-radial from-blue-500/8 via-purple-500/4 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-radial from-blue-500/6 via-purple-500/3 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-radial from-purple-500/6 via-blue-500/3 to-transparent rounded-full blur-3xl opacity-60"></div>

          <div
            className="relative backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-300"
            style={{
              background: `
                radial-gradient(ellipse at top left, rgba(30, 27, 75, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse at bottom right, rgba(15, 23, 42, 0.12) 0%, transparent 60%),
                rgba(0, 0, 0, 0.6)
              `,
            }}
          >
            {/* Title Input */}
            <div className="relative mb-6 sm:mb-8">
              <input
                type="text"
                placeholder="Add paste title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-0 text-white placeholder:text-gray-500 placeholder:text-base text-xl sm:text-2xl font-normal focus:outline-none focus:ring-0 transition-all duration-200"
                style={{ fontFamily: "inherit" }}
              />
              {title && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 animate-fade-in-up">
                  <Sparkles className="w-5 h-5 text-blue-400 animate-sparkle" />
                </div>
              )}
            </div>

            {/* Separator Line */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6 sm:mb-8"></div>

            {/* Content Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                placeholder="Paste your code, text, or links here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent border-0 text-white placeholder:text-gray-500 placeholder:text-base min-h-[300px] sm:min-h-[500px] resize-none text-sm sm:text-base leading-relaxed font-normal focus:outline-none focus:ring-0 transition-all duration-200"
                style={{
                  minHeight: "300px",
                  height: "auto",
                  overflow: "hidden",
                  fontFamily: "inherit",
                }}
              />
              {content && (
                <div className="absolute top-2 sm:top-4 right-0 flex items-center space-x-2 animate-slide-in">
                  <div className="text-xs text-gray-400 bg-black/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-normal border border-white/5 micro-scale">
                    {content.length} chars
                  </div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/5 space-y-4 sm:space-y-0">
              <div className="flex items-center justify-center sm:justify-start space-x-4 sm:space-x-8">
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`flex items-center space-x-2 text-xs sm:text-sm font-normal transition-all duration-200 micro-scale ${
                    isPublic ? "text-blue-400 hover:text-blue-300" : "text-pink-400 hover:text-pink-300"
                  }`}
                >
                  {isPublic ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{isPublic ? "Public" : "Private"}</span>
                </button>

                <button className="flex items-center space-x-2 text-xs sm:text-sm font-normal text-gray-400 hover:text-white transition-all duration-200 micro-scale">
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Import</span>
                </button>

                <button className="flex items-center space-x-2 text-xs sm:text-sm font-normal text-gray-400 hover:text-white transition-all duration-200 micro-scale">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Template</span>
                </button>
              </div>

              <Button
                onClick={handleCreatePaste}
                disabled={!content.trim() || loading}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border-0 btn-hover"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : showSuccess ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Created!</span>
                  </div>
                ) : (
                  "Create Paste"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        {content && (
          <div className="absolute -bottom-4 left-4 sm:left-8 right-4 sm:right-8 animate-slide-in">
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between micro-scale space-y-2 sm:space-y-0">
              <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-6 text-xs sm:text-sm text-gray-400 font-normal">
                <span>Lines: {content.split("\n").length}</span>
                <span>Words: {content.split(" ").filter((w) => w.length > 0).length}</span>
                <span>Chars: {content.length}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 font-normal">Auto-save enabled</span>
              </div>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {showNotification && (
          <div className="fixed bottom-4 right-4 z-50 animate-slide-in-up">
            <div className="bg-green-500/90 backdrop-blur-xl border border-green-400/20 rounded-xl p-4 shadow-2xl">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-100" />
                <div>
                  <p className="text-sm font-medium text-green-100">Link Copied to Clipboard</p>
                  <p className="text-xs text-green-200/80">
                    {createdPasteId ? `/${createdPasteId}` : 'Paste link copied'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
