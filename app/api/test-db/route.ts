import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Test a simple query
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      environment: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 