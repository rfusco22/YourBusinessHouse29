-- Create inmueble_images table to support multiple images per property
CREATE TABLE IF NOT EXISTS inmueble_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  inmueble_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inmueble_id) REFERENCES inmueble(id) ON DELETE CASCADE,
  INDEX idx_inmueble_images_order (inmueble_id, display_order)
);
