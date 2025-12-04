-- Add operation_type and last transaction tracking to properties table
-- This migration adds fields to track whether a property is for sale, rent, or both
-- and when was the last transaction (sale or rental)

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS operation_type ENUM('compra', 'alquiler', 'ambos') DEFAULT 'compra' AFTER rental_price,
ADD COLUMN IF NOT EXISTS last_sale_date DATETIME AFTER operation_type,
ADD COLUMN IF NOT EXISTS last_rental_date DATETIME AFTER last_sale_date;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_operation_type ON properties(operation_type);
CREATE INDEX IF NOT EXISTS idx_last_sale_date ON properties(last_sale_date);
CREATE INDEX IF NOT EXISTS idx_last_rental_date ON properties(last_rental_date);

-- Update transactions table to track the actual transaction date
ALTER TABLE transactions
MODIFY COLUMN transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
