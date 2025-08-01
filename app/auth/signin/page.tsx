"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Code,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { useHydration } from "@/hooks/use-hydration"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const isHydrated = useHydration()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        setSuccess("Signing you in...")
        setTimeout(() => {
          router.push("/")
        }, 1000)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#329D9C] via-[#4BC78A] to-[#5AD89C] ${isHydrated ? "animate-fade-in" : "opacity-0"}`}>
      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative micro-scale">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#329D9C] to-[#5AD89C] p-0.5">
                  <div className="w-full h-full bg-black rounded-md flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#329D9C] via-[#4BC78A] to-[#5AD89C] bg-clip-text text-transparent">
                PasteScript
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md">
          {/* Form Container */}
          <div className="relative">
            {/* Background Effects */}
                      <div className="absolute -inset-4 bg-gradient-to-br from-[#329D9C]/15 via-[#4BC78A]/10 to-[#5AD89C]/15 rounded-3xl blur-3xl opacity-30"></div>
          <div className="absolute -top-6 -left-6 w-40 h-40 bg-gradient-radial from-[#329D9C]/8 via-[#4BC78A]/4 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-radial from-[#4BC78A]/8 via-[#5AD89C]/4 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-radial from-[#5AD89C]/6 via-[#329D9C]/3 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-radial from-[#329D9C]/6 via-[#4BC78A]/3 to-transparent rounded-full blur-3xl opacity-60"></div>

            <div className="relative backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400">Sign in to your account</p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">{success}</span>
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#329D9C] via-[#4BC78A] to-[#5AD89C] hover:from-[#2A8A89] hover:via-[#3DB679] hover:to-[#4BC78A] text-white py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 