import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateUniqueShortId } from '@/lib/short-id'

// Validation schema for creating a paste
const createPasteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  language: z.string().optional(),
  isPublic: z.boolean().default(true),
  isPassword: z.boolean().default(false),
  password: z.string().optional(),
  expiresAt: z.string().optional(), // ISO date string
  userId: z.string().optional(), // User ID for authenticated users
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPasteSchema.parse(body)

    // Generate a unique short ID
    const shortId = await generateUniqueShortId()

    // Create the paste with connection management
    const paste = await prisma.paste.create({
      data: {
        id: shortId,
        title: validatedData.title,
        content: validatedData.content,
        language: validatedData.language,
        isPublic: validatedData.isPublic,
        isPassword: validatedData.isPassword,
        password: validatedData.password,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        userId: validatedData.userId || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: paste,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    // Handle database connection errors specifically
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as any).message
      if (errorMessage.includes('Max client connections reached') || 
          errorMessage.includes('connection') ||
          errorMessage.includes('FATAL')) {
        console.error('Database connection error:', error)
        return NextResponse.json(
          {
            success: false,
            error: 'Database temporarily unavailable. Please try again in a moment.',
          },
          { status: 503 }
        )
      }
    }

    console.error('Error creating paste:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const language = searchParams.get('language') || ''
    const userId = searchParams.get('userId') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isPublic: true,
    }

    // If userId is provided, show all pastes for that user (including private ones)
    if (userId) {
      where.userId = userId
      delete where.isPublic // Remove the public filter for user's own pastes
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (language) {
      where.language = language
    }

    // Get pastes with pagination
    const [pastes, total] = await Promise.all([
      prisma.paste.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.paste.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: pastes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching pastes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
} 