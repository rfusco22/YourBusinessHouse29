-- agregar columna de estacionamiento a properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking INT DEFAULT 0;

-- crear tabla para amenidades
CREATE TABLE IF NOT EXISTS property_amenities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  amenity_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property_id (property_id)
);

-- crear tabla para imágenes de propiedades
CREATE TABLE IF NOT EXISTS property_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property_id (property_id)
);
