-- Create bitacora (log) table for tracking property visits and counter-offers
CREATE TABLE IF NOT EXISTS bitacora (
  id INT PRIMARY KEY AUTO_INCREMENT,
  inmueble_id INT NOT NULL,
  user_id INT NOT NULL,
  type ENUM('visita', 'contraoferta') NOT NULL,
  description TEXT NOT NULL,
  visit_date DATE,
  offer_amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (inmueble_id) REFERENCES inmueble(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX idx_bitacora_user ON bitacora(user_id);
CREATE INDEX idx_bitacora_inmueble ON bitacora(inmueble_id);
CREATE INDEX idx_bitacora_created ON bitacora(created_at);

-- Verification
SELECT 'Bitacora table created successfully!' as status;
