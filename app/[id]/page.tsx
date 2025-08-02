import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PastePageClient from './paste-page-client'

interface PageProps {
  params: {
    id: string
  }
}

export default async function PastePage({ params }: PageProps) {
  const { id } = params

  try {
    // Fetch paste data server-side
    const paste = await prisma.paste.findUnique({
      where: { id },
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
      notFound()
    }

    // Check if paste is expired
    if (paste.expiresAt && paste.expiresAt < new Date()) {
      notFound()
    }

    // Return the client component with the paste data
    return <PastePageClient initialPaste={paste} />
  } catch (error) {
    console.error('Error fetching paste:', error)
    notFound()
  }
} 