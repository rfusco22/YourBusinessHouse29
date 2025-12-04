-- Add missing columns to properties table for images and parking
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured_image_url VARCHAR(500);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking INT DEFAULT 0;

-- Verify table structure
DESCRIBE properties;
