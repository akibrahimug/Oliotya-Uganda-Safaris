-- Add second gallery images field to destinations table
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS "gallery2Images" TEXT[] NOT NULL DEFAULT '{}';

-- Add second gallery images field to packages table
ALTER TABLE packages ADD COLUMN IF NOT EXISTS "gallery2Images" TEXT[] NOT NULL DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN destinations."gallery2Images" IS 'Second gallery images for destinations detail page';
COMMENT ON COLUMN packages."gallery2Images" IS 'Second gallery images for packages detail page';