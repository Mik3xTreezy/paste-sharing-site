const { PrismaClient } = require('@prisma/client')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// This script migrates data from SQLite to Supabase
// Run this after setting up your Supabase connection

async function migrateData() {
  console.log('Starting data migration from SQLite to Supabase...')
  
  // Connect to SQLite database
  const sqliteDb = new sqlite3.Database(path.join(__dirname, '../prisma/dev.db'))
  
  // Connect to Supabase via Prisma
  const prisma = new PrismaClient()
  
  try {
    // Migrate users
    console.log('Migrating users...')
    const users = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM users', (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
    
    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          password: user.password,
          avatar: user.avatar,
          bio: user.bio,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }
      })
    }
    console.log(`Migrated ${users.length} users`)
    
    // Migrate pastes
    console.log('Migrating pastes...')
    const pastes = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM pastes', (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
    
    for (const paste of pastes) {
      await prisma.paste.upsert({
        where: { id: paste.id },
        update: {},
        create: {
          id: paste.id,
          title: paste.title,
          content: paste.content,
          language: paste.language,
          isPublic: Boolean(paste.isPublic),
          isPassword: Boolean(paste.isPassword),
          password: paste.password,
          expiresAt: paste.expiresAt ? new Date(paste.expiresAt) : null,
          views: paste.views,
          userId: paste.userId || null,
          createdAt: new Date(paste.createdAt),
          updatedAt: new Date(paste.updatedAt),
        }
      })
    }
    console.log(`Migrated ${pastes.length} pastes`)
    
    console.log('Migration completed successfully!')
    
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
    sqliteDb.close()
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateData()
}

module.exports = { migrateData } 