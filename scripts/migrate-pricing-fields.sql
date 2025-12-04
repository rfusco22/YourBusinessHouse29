-- Add rental_price and purchase_price columns to inmueble table
ALTER TABLE inmueble 
ADD COLUMN rental_price DECIMAL(15, 2) DEFAULT NULL AFTER price,
ADD COLUMN purchase_price DECIMAL(15, 2) DEFAULT NULL AFTER rental_price;

-- Populate existing data: if price exists, use it as purchase_price for "compra" operations
UPDATE inmueble 
SET purchase_price = price 
WHERE operation_type = 'compra' AND purchase_price IS NULL;

-- Populate existing data: if price exists, use it as rental_price for "alquiler" operations
UPDATE inmueble 
SET rental_price = price 
WHERE operation_type = 'alquiler' AND rental_price IS NULL;

-- For "ambos" operations, use price as purchase_price by default
UPDATE inmueble 
SET purchase_price = price 
WHERE operation_type = 'ambos' AND purchase_price IS NULL;
