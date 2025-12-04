-- Create table for property approval workflow
-- This table tracks pending, approved, and rejected properties
CREATE TABLE IF NOT EXISTS property_approvals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL UNIQUE,
  asesor_id INT NOT NULL,
  status ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
  admin_notes TEXT,
  approved_by INT,
  approval_date TIMESTAMP NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (asesor_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_asesor (asesor_id),
  INDEX idx_approval_date (approval_date)
);

-- Modify properties table to add approval_status column if it doesn't exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS approval_status ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente';
