-- Safely create the views table and handle existing constraints
-- This script will work whether the table exists or not

-- Create the views table if it doesn't exist
CREATE TABLE IF NOT EXISTS "views" (
  "id" TEXT NOT NULL,
  "ipAddress" TEXT NOT NULL,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "pasteId" TEXT NOT NULL
);

-- Add primary key if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'views_pkey') THEN
    ALTER TABLE "views" ADD CONSTRAINT "views_pkey" PRIMARY KEY ("id");
  END IF;
END $$;

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'views_ipAddress_pasteId_key') THEN
    CREATE UNIQUE INDEX "views_ipAddress_pasteId_key" ON "views"("ipAddress", "pasteId");
  END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'views_pasteId_fkey') THEN
    ALTER TABLE "views" ADD CONSTRAINT "views_pasteId_fkey" FOREIGN KEY ("pasteId") REFERENCES "pastes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Add indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'views_pasteId_idx') THEN
    CREATE INDEX "views_pasteId_idx" ON "views"("pasteId");
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'views_ipAddress_idx') THEN
    CREATE INDEX "views_ipAddress_idx" ON "views"("ipAddress");
  END IF;
END $$;

-- Show the final table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'views' 
ORDER BY ordinal_position; 