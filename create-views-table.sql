-- Create the View table for tracking IP-based views
CREATE TABLE IF NOT EXISTS "View" (
  "id" TEXT NOT NULL,
  "ipAddress" TEXT NOT NULL,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "pasteId" TEXT NOT NULL,

  CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for IP + Paste combination
CREATE UNIQUE INDEX IF NOT EXISTS "View_ipAddress_pasteId_key" ON "View"("ipAddress", "pasteId");

-- Create foreign key constraint
ALTER TABLE "View" ADD CONSTRAINT "View_pasteId_fkey" FOREIGN KEY ("pasteId") REFERENCES "Paste"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS "View_pasteId_idx" ON "View"("pasteId");
CREATE INDEX IF NOT EXISTS "View_ipAddress_idx" ON "View"("ipAddress"); 