"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Code, 
  Eye, 
  Calendar, 
  User, 
  ArrowLeft,
  Filter,
  Clock,
  Edit,
  Trash2,
  Plus,
  Lock,
  Globe
} from "lucide-react"
import { usePaste } from "@/hooks/use-paste"
import { Paste } from "@/hooks/use-paste"
import { useHydration } from "@/hooks/use-hydration"

export default function MyPastesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { getPastes, deletePaste, loading, error } = usePaste()
  const [pastes, setPastes] = useState<Paste[]>([])
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [deletingPaste, setDeletingPaste] = useState<string | null>(null)
  const isHydrated = useHydration()

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const fetchMyPastes = async () => {
    if (!session?.user?.id) return

    const result = await getPastes({
      page,
      limit: 12,
      search: search.trim(),
      language: language.trim(),
      userId: session.user.id,
    })

    if (result) {
      setPastes(result.pastes)
      setPagination(result.pagination)
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchMyPastes()
    }
  }, [page, search, language, session?.user?.id])

  const handleDeletePaste = async (pasteId: string) => {
    if (!confirm("Are you sure you want to delete this paste?")) return

    setDeletingPaste(pasteId)
    const success = await deletePaste(pasteId)
    
    if (success) {
      setPastes(pastes.filter(paste => paste.id !== pasteId))
    }
    
    setDeletingPaste(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'php',
    'html', 'css', 'sql', 'bash', 'markdown', 'json', 'xml', 'yaml'
  ]

  // Show loading while checking authentication
  if (status === "loading" || !isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show loading while not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
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
              <h1 className="text-xl font-bold text-white">My Pastes</h1>
            </div>
            <Button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Paste
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your pastes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Language Filter */}
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
            <span className="text-red-400 font-medium">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your pastes...</p>
          </div>
        )}

        {/* Pastes Grid */}
        {!loading && (
          <>
            {pastes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No pastes found</h3>
                <p className="text-gray-400 mb-4">You haven't created any pastes yet, or your pastes were created before you signed in.</p>
                <p className="text-gray-500 mb-6 text-sm">Note: Pastes created while not signed in won't appear here.</p>
                <Button
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Paste
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastes.map((paste) => (
                  <div
                    key={paste.id}
                    className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-200 hover:bg-black/40 hover:border-white/20"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Code className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-gray-400">
                          {paste.language || 'text'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {paste.isPublic ? (
                          <Globe className="w-3 h-3 text-green-400" />
                        ) : (
                          <Lock className="w-3 h-3 text-yellow-400" />
                        )}
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Eye className="w-3 h-3" />
                          <span>{paste.views}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    {paste.title && (
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                        {paste.title}
                      </h3>
                    )}

                    {/* Content Preview */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 font-mono">
                      {truncateContent(paste.content)}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(paste.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/${paste.id}`)}
                        className="flex-1 bg-black/20 border-white/20 text-gray-300 hover:bg-gray-800"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/${paste.id}/edit`)}
                        className="bg-black/20 border-white/20 text-gray-300 hover:bg-gray-800"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePaste(paste.id)}
                        disabled={deletingPaste === paste.id}
                        className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                      >
                        {deletingPaste === paste.id ? (
                          <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="bg-black/20 border-white/20 text-gray-300 hover:bg-gray-800"
                >
                  Previous
                </Button>
                
                <span className="text-gray-400 text-sm">
                  Page {page} of {pagination.pages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                  className="bg-black/20 border-white/20 text-gray-300 hover:bg-gray-800"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 