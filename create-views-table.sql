-- Create the View table for tracking IP-based views
CREATE TABLE IF NOT EXISTS "views" (
  "id" TEXT NOT NULL,
  "ipAddress" TEXT NOT NULL,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "pasteId" TEXT NOT NULL,

  CONSTRAINT "views_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for IP + Paste combination
CREATE UNIQUE INDEX IF NOT EXISTS "views_ipAddress_pasteId_key" ON "views"("ipAddress", "pasteId");

-- Create foreign key constraint
ALTER TABLE "views" ADD CONSTRAINT "views_pasteId_fkey" FOREIGN KEY ("pasteId") REFERENCES "pastes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS "views_pasteId_idx" ON "views"("pasteId");
CREATE INDEX IF NOT EXISTS "views_ipAddress_idx" ON "views"("ipAddress"); 