-- Fix: Add operation_type and last transaction tracking to inmueble table
-- This migration adds fields to track whether a property is for sale, rent, or both
-- and when was the last transaction (sale or rental)

ALTER TABLE inmueble 
ADD COLUMN IF NOT EXISTS operation_type ENUM('compra', 'alquiler', 'ambos') DEFAULT 'compra' AFTER price,
ADD COLUMN IF NOT EXISTS last_sale_date DATETIME AFTER operation_type,
ADD COLUMN IF NOT EXISTS last_rental_date DATETIME AFTER last_sale_date;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_operation_type ON inmueble(operation_type);
CREATE INDEX IF NOT EXISTS idx_last_sale_date ON inmueble(last_sale_date);
CREATE INDEX IF NOT EXISTS idx_last_rental_date ON inmueble(last_rental_date);

-- Also ensure alert_notifications table exists
CREATE TABLE IF NOT EXISTS alert_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  message_sid VARCHAR(100),
  notified_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_alert (property_id, alert_type, DATE(notified_at)),
  INDEX idx_property_alert (property_id, alert_type),
  INDEX idx_notified_at (notified_at)
);
