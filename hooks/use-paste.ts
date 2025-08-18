import { useState } from 'react'
import { detectLanguage } from '@/lib/language-detection'

export interface Paste {
  id: string
  title?: string
  content: string
  language?: string
  isPublic: boolean
  isPassword: boolean
  password?: string
  expiresAt?: string
  views: number
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    username?: string
    name?: string
    avatar?: string
  }
  _count?: {
    likes: number
    comments: number
  }
}

export interface CreatePasteData {
  title?: string
  content: string
  language?: string
  isPublic: boolean
  isPassword: boolean
  password?: string
  expiresAt?: string
  userId?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: any
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function usePaste() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPaste = async (data: CreatePasteData): Promise<Paste | null> => {
    setLoading(true)
    setError(null)

    try {
      // Auto-detect language if not provided
      const language = data.language || detectLanguage(data.content)
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

      const response = await fetch(`${baseUrl}/api/pastes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          language,
        }),
      })

      const result: ApiResponse<Paste> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create paste')
      }

      return result.data || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getPaste = async (id: string, password?: string): Promise<Paste | null> => {
    setLoading(true)
    setError(null)

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const url = password 
        ? `${baseUrl}/api/pastes/${id}?password=${encodeURIComponent(password)}`
        : `${baseUrl}/api/pastes/${id}`

      const response = await fetch(url)
      const result: ApiResponse<Paste> = await response.json()

      if (!result.success) {
        if (response.status === 401 && result.requiresPassword) {
          throw new Error('Password required')
        }
        throw new Error(result.error || 'Failed to fetch paste')
      }

      return result.data || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updatePaste = async (id: string, data: Partial<CreatePasteData>): Promise<Paste | null> => {
    setLoading(true)
    setError(null)

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const response = await fetch(`${baseUrl}/api/pastes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result: ApiResponse<Paste> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update paste')
      }

      return result.data || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deletePaste = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const response = await fetch(`${baseUrl}/api/pastes/${id}`, {
        method: 'DELETE',
      })

      const result: ApiResponse<any> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete paste')
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getPastes = async (params?: {
    page?: number
    limit?: number
    search?: string
    language?: string
    userId?: string
  }): Promise<{ pastes: Paste[]; pagination?: any } | null> => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.search) searchParams.append('search', params.search)
      if (params?.language) searchParams.append('language', params.language)
      if (params?.userId) searchParams.append('userId', params.userId)

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const url = `${baseUrl}/api/pastes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

      const response = await fetch(url)
      const result: ApiResponse<Paste[]> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch pastes')
      }

      return {
        pastes: result.data || [],
        pagination: result.pagination,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createPaste,
    getPaste,
    updatePaste,
    deletePaste,
    getPastes,
  }
}

// Export getPaste as a standalone function for direct use
export async function getPaste(id: string, password?: string): Promise<Paste | null> {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const url = password 
      ? `${baseUrl}/api/pastes/${id}?password=${encodeURIComponent(password)}`
      : `${baseUrl}/api/pastes/${id}`

    const response = await fetch(url)
    const result: ApiResponse<Paste> = await response.json()

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch paste')
    }

    return result.data || null
  } catch (err) {
    console.error('Error fetching paste:', err)
    return null
  }
} 