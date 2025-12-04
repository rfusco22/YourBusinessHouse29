-- Add parking column to inmueble table if it doesn't exist
ALTER TABLE inmueble ADD COLUMN IF NOT EXISTS parking INT DEFAULT 0;
