import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getClientIP } from '@/lib/get-client-ip'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if paste exists
    const paste = await prisma.paste.findUnique({
      where: { id },
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
      const updatedPaste = await prisma.paste.update({
        where: { id },
        data: { views: { increment: 1 } },
      })

      return NextResponse.json({
        success: true,
        views: updatedPaste.views,
        message: 'View tracked successfully',
      })
    } catch (error: any) {
      // If view record already exists (same IP), return current view count without incrementing
      if (error.code === 'P2002') {
        // Unique constraint violation - IP already viewed this paste
        const currentPaste = await prisma.paste.findUnique({
          where: { id },
          select: { views: true },
        })

        return NextResponse.json({
          success: true,
          views: currentPaste?.views || paste.views,
          message: 'View already recorded for this IP',
        })
      }

      // Re-throw other errors
      throw error
    }
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
