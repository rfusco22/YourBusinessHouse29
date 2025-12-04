-- Create rental permission requests table
-- This tracks when asesors request to change rental status back to available
CREATE TABLE IF NOT EXISTS rental_permission_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  inmueble_id INT NOT NULL,
  asesor_id INT NOT NULL,
  request_type ENUM('disponible_request', 'property_approval') NOT NULL,
  status ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
  justification TEXT NOT NULL,
  admin_notes TEXT,
  reviewed_by INT,
  review_date TIMESTAMP NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (inmueble_id) REFERENCES inmueble(id) ON DELETE CASCADE,
  FOREIGN KEY (asesor_id) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_asesor (asesor_id),
  INDEX idx_inmueble (inmueble_id),
  INDEX idx_request_type (request_type),
  INDEX idx_review_date (review_date)
);

-- Verification
SELECT 'Rental permission requests table created successfully!' as status;
