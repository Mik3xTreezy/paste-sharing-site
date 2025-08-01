-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");

-- Create Paste table
CREATE TABLE IF NOT EXISTS "Paste" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "language" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT,
    "expiresAt" TIMESTAMP(3),
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Paste_pkey" PRIMARY KEY ("id")
);

-- Create Tag table
CREATE TABLE IF NOT EXISTS "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- Create Like table
CREATE TABLE IF NOT EXISTS "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pasteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- Create Comment table
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pasteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- Create Bookmark table
CREATE TABLE IF NOT EXISTS "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pasteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- Create _PasteToTag table for many-to-many relationship
CREATE TABLE IF NOT EXISTS "_PasteToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- Create unique indexes for many-to-many relationships
CREATE UNIQUE INDEX IF NOT EXISTS "_PasteToTag_AB_unique" ON "_PasteToTag"("A", "B");
CREATE INDEX IF NOT EXISTS "_PasteToTag_B_index" ON "_PasteToTag"("B");

-- Add foreign key constraints
ALTER TABLE "Paste" ADD CONSTRAINT "Paste_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Like" ADD CONSTRAINT "Like_pasteId_fkey" FOREIGN KEY ("pasteId") REFERENCES "Paste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pasteId_fkey" FOREIGN KEY ("pasteId") REFERENCES "Paste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_pasteId_fkey" FOREIGN KEY ("pasteId") REFERENCES "Paste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "_PasteToTag" ADD CONSTRAINT "_PasteToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Paste"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PasteToTag" ADD CONSTRAINT "_PasteToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE; 