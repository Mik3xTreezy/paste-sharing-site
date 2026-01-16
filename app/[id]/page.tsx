import { notFound, redirect } from 'next/navigation'
import Script from 'next/script'
import { prisma } from '@/lib/prisma'
import PastePageClient from './paste-page-client'
import ErrorBoundary from '@/components/error-boundary'
import { generateUniqueShortId } from '@/lib/short-id'

async function convertPasteFromSource(pasteId: string, sourceUrl: string) {
  try {
    // Check if we already have this paste converted
    const existingPaste = await prisma.paste.findFirst({
      where: {
        content: {
          contains: sourceUrl,
        },
      },
    })

    if (existingPaste) {
      return existingPaste
    }

    // Try to fetch content from the original source
    let content = ''
    let title = `Converted from ${new URL(sourceUrl).hostname}`

    try {
      // Try different common raw URL patterns based on the service
      const hostname = new URL(sourceUrl).hostname.toLowerCase()
      let rawUrls: string[] = []

      if (hostname.includes('pastebin.com')) {
        rawUrls = [
          sourceUrl.replace('//', '//pastebin.com/raw/'),
          sourceUrl + '/raw',
          sourceUrl.replace('pastebin.com/', 'pastebin.com/raw/'),
        ]
      } else if (hostname.includes('hastebin.com')) {
        rawUrls = [
          sourceUrl.replace('hastebin.com/', 'hastebin.com/raw/'),
          sourceUrl + '/raw',
        ]
      } else if (hostname.includes('dpaste.com')) {
        rawUrls = [
          sourceUrl + '.txt',
          sourceUrl + '/raw',
        ]
      } else if (hostname.includes('gist.github.com')) {
        rawUrls = [
          sourceUrl + '/raw',
          sourceUrl.replace('gist.github.com', 'gist.githubusercontent.com') + '/raw',
        ]
      } else {
        // Generic fallbacks
        rawUrls = [
          sourceUrl + '/raw',
          sourceUrl.replace(/\/([^\/]+)$/, '/raw/$1'),
          sourceUrl + '?raw=1',
          sourceUrl + '.txt',
        ]
      }

      let fetchedContent = false
      for (const rawUrl of rawUrls) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000)
          
          const response = await fetch(rawUrl, {
            headers: {
              'User-Agent': 'PasteScript-Converter/1.0',
            },
            signal: controller.signal,
          })
          
          clearTimeout(timeoutId)

          if (response.ok) {
            content = await response.text()
            // Basic validation - ensure we got actual content, not HTML error page
            if (content && content.length > 0 && !content.includes('<html>') && !content.includes('<!DOCTYPE')) {
              fetchedContent = true
              break
            }
          }
        } catch (e) {
          // Continue to next URL
        }
      }

      if (!fetchedContent) {
        // Fallback: create a placeholder paste with link to original
        content = `This paste was converted from: ${sourceUrl}\n\nOriginal paste ID: ${pasteId}\n\nNote: Could not automatically fetch content. Please visit the original link above.`
      }
    } catch (error) {
      // Fallback: create a placeholder paste with link to original
      content = `This paste was converted from: ${sourceUrl}\n\nOriginal paste ID: ${pasteId}\n\nNote: Could not automatically fetch content. Please visit the original link above.`
    }

    // Create a new paste with the converted content
    const shortId = await generateUniqueShortId()

    const paste = await prisma.paste.create({
      data: {
        id: shortId,
        title,
        content,
        language: 'text', // Default to text, could be enhanced with language detection
        isPublic: true,
        isPassword: false,
        password: null,
        expiresAt: null,
        userId: null, // Anonymous paste
      },
    })

    return paste
  } catch (error) {
    console.error('Error converting paste:', error)
    return null
  }
}

interface PageProps {
  params: {
    id: string
  }
  searchParams: {
    source?: string
    token?: string
  }
}

export default async function PastePage({ params, searchParams }: PageProps) {
  // Next.js 15+ requires await for params
  const { id } = await params
  const { source } = searchParams

  try {
    // Check if this is a conversion request
    if (source) {
      // Try to convert the paste from the source
      const convertedPaste = await convertPasteFromSource(id, source)
      if (convertedPaste) {
        // Redirect to the converted paste
        redirect(`/${convertedPaste.id}`)
      }
    }

    // Fetch paste data server-side
    // Trim and normalize the ID to handle any whitespace or case issues
    const normalizedId = id.trim()
    
    console.log(`[PastePage] Looking for paste with ID: "${normalizedId}"`)
    
    const paste = await prisma.paste.findUnique({
      where: { id: normalizedId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!paste) {
      console.log(`[PastePage] Paste not found for ID: "${normalizedId}"`)
      // Try to find any paste with similar ID (case-insensitive check)
      const allPastes = await prisma.paste.findMany({
        where: {
          id: {
            contains: normalizedId,
            mode: 'insensitive',
          },
        },
        take: 5,
        select: { id: true },
      })
      if (allPastes.length > 0) {
        console.log(`[PastePage] Found similar IDs:`, allPastes.map(p => p.id))
      }
      notFound()
    }
    
    console.log(`[PastePage] Found paste: ${paste.id}, title: ${paste.title || 'No title'}`)

    // Check if paste is expired
    if (paste.expiresAt && paste.expiresAt < new Date()) {
      notFound()
    }

    // Return the client component with the paste data
    return (
      <>
        <Script src="https://capriceawelessaweless.com/a1/13/07/a113078fb08efadf0594c1e8d2e2a8d2.js" strategy="beforeInteractive" />
        <ErrorBoundary>
          <PastePageClient initialPaste={paste} />
        </ErrorBoundary>
      </>
    )
  } catch (error) {
    console.error('Error fetching paste:', error)
    notFound()
  }
} 