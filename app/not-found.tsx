import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Code, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto p-6 text-center">
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="mb-8">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileQuestion className="w-12 h-12 text-blue-500" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <h2 className="text-2xl font-bold text-white mb-4">Paste Not Found</h2>
            <p className="text-gray-400 mb-8">
              The paste you're looking for doesn't exist, may have been deleted, or has expired.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button className="btn-gradient-primary px-8 py-3 text-lg font-semibold">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" className="btn-gradient-secondary px-8 py-3 text-lg font-semibold">
                <Code className="w-5 h-5 mr-2" />
                Browse Pastes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

