-- Add image URL column to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS image_url TEXT;
