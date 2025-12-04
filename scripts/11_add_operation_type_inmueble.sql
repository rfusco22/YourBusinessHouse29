-- Fixed migration script with correct order of operations
-- First add rental_price if it doesn't exist
ALTER TABLE inmueble ADD COLUMN IF NOT EXISTS rental_price DECIMAL(15, 2);

-- Add other necessary columns
ALTER TABLE inmueble ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE inmueble ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE inmueble ADD COLUMN IF NOT EXISTS garage_spaces INT DEFAULT 0;
ALTER TABLE inmueble ADD COLUMN IF NOT EXISTS featured_image_url VARCHAR(500);

-- Use VARCHAR instead of ENUM for better compatibility
ALTER TABLE inmueble ADD COLUMN IF NOT EXISTS operation_type VARCHAR(20) DEFAULT 'compra';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_operation_type ON inmueble(operation_type);
