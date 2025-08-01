import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getClientIP } from '@/lib/get-client-ip'

// Validation schema for updating a paste
const updatePasteSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  language: z.string().optional(),
  isPublic: z.boolean().optional(),
  isPassword: z.boolean().optional(),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const password = searchParams.get('password')

    // Find the paste
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
        // Temporarily remove tags to avoid relationship issues
        // tags: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            views: true,
          },
        },
      },
    })

    if (!paste) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paste not found',
        },
        { status: 404 }
      )
    }

    // Check if paste is expired
    if (paste.expiresAt && paste.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paste has expired',
        },
        { status: 410 }
      )
    }

    // Check password protection
    if (paste.isPassword && paste.password !== password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password required',
          requiresPassword: true,
        },
        { status: 401 }
      )
    }

    // Track view with IP-based counting (once per IP per paste)
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || null

    try {
      // Try to create a new view record (will fail if IP already viewed this paste)
      await prisma.view.create({
        data: {
          ipAddress: clientIP,
          userAgent,
          pasteId: id,
        },
      })

      // If successful, increment the view count
      await prisma.paste.update({
        where: { id },
        data: { views: { increment: 1 } },
      })
    } catch (error) {
      // If view record already exists (same IP), don't increment
      // This is expected behavior for repeat visits
      console.log(`View already recorded for IP ${clientIP} on paste ${id}`)
    }

    return NextResponse.json({
      success: true,
      data: paste,
    })
  } catch (error) {
    console.error('Error fetching paste:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const validatedData = updatePasteSchema.parse(body)

    // Check if paste exists
    const existingPaste = await prisma.paste.findUnique({
      where: { id },
    })

    if (!existingPaste) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paste not found',
        },
        { status: 404 }
      )
    }

    // Update the paste
    const updatedPaste = await prisma.paste.update({
      where: { id },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        language: validatedData.language,
        isPublic: validatedData.isPublic,
        isPassword: validatedData.isPassword,
        password: validatedData.password,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedPaste,
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

    console.error('Error updating paste:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if paste exists
    const existingPaste = await prisma.paste.findUnique({
      where: { id },
    })

    if (!existingPaste) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paste not found',
        },
        { status: 404 }
      )
    }

    // Delete the paste
    await prisma.paste.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Paste deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting paste:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
} 