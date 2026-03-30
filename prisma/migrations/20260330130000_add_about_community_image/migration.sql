-- Add CMS-editable image for About Community section
ALTER TABLE "about_community_section"
ADD COLUMN "image" TEXT;

-- Backfill existing records with a representative Akaana Foundation image
UPDATE "about_community_section"
SET "image" = 'https://primary.jwwb.nl/public/t/h/l/temp-ujyvkhzneqwueosbcaow/foto02-high.JPG?enable-io=true&enable=upscale&crop=1366%2C768%2Cx0%2Cy68%2Csafe&width=1170&height=658'
WHERE "image" IS NULL;
