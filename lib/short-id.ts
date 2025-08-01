// Generate a short 5-character ID
export function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Generate a unique short ID (with collision checking)
export async function generateUniqueShortId(): Promise<string> {
  const { prisma } = await import('@/lib/prisma')
  
  let attempts = 0
  const maxAttempts = 10
  
  while (attempts < maxAttempts) {
    const id = generateShortId()
    
    // Check if ID already exists
    const existing = await prisma.paste.findUnique({
      where: { id }
    })
    
    if (!existing) {
      return id
    }
    
    attempts++
  }
  
  // If we can't find a unique ID after max attempts, add a number suffix
  return generateShortId() + Math.floor(Math.random() * 10)
} 