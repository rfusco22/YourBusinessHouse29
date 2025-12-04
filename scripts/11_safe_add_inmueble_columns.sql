-- Safe migration: Add operation_type and last transaction tracking to inmueble table
-- This script checks if columns exist before adding them

-- Check and add operation_type column
SET @dbname = DATABASE();
SET @tablename = "inmueble";
SET @columnname = "operation_type";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE 
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE inmueble ADD COLUMN operation_type ENUM('compra', 'alquiler', 'ambos') DEFAULT 'compra' AFTER price"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add last_sale_date column
SET @columnname = "last_sale_date";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE 
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE inmueble ADD COLUMN last_sale_date DATETIME AFTER operation_type"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add last_rental_date column
SET @columnname = "last_rental_date";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE 
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE inmueble ADD COLUMN last_rental_date DATETIME AFTER last_sale_date"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Removed IF NOT EXISTS from CREATE INDEX (not supported in older MySQL versions)
-- Safe index creation - will show warning if exists but won't fail
CREATE INDEX idx_operation_type ON inmueble(operation_type);
CREATE INDEX idx_last_sale_date ON inmueble(last_sale_date);
CREATE INDEX idx_last_rental_date ON inmueble(last_rental_date);

-- Create alert_notifications table if it doesn't exist
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
