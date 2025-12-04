-- Create inmueble table as the main properties table
CREATE TABLE IF NOT EXISTS inmueble (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  area DECIMAL(10, 2) DEFAULT 0,
  owner_id INT NOT NULL,
  status ENUM('disponible', 'vendido', 'alquilado') DEFAULT 'disponible',
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Create amenities table for inmuebles
CREATE TABLE IF NOT EXISTS inmueble_amenities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  inmueble_id INT NOT NULL,
  amenity_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inmueble_id) REFERENCES inmueble(id) ON DELETE CASCADE
);

-- Add index for faster queries
CREATE INDEX idx_inmueble_owner ON inmueble(owner_id);
CREATE INDEX idx_inmueble_status ON inmueble(status);
CREATE INDEX idx_inmueble_created ON inmueble(created_at);
