-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  bedrooms INT,
  bathrooms INT,
  area DECIMAL(10, 2),
  owner_id INT NOT NULL,
  status ENUM('disponible', 'vendido', 'alquilado') DEFAULT 'disponible',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_id INT,
  user_id INT NOT NULL,
  status ENUM('activa', 'resuelta') DEFAULT 'activa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create bitacora (visits and counteroffers) table
CREATE TABLE IF NOT EXISTS bitacora (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  user_id INT NOT NULL,
  type ENUM('visita', 'contraoferta') NOT NULL,
  notes TEXT,
  visit_date DATETIME,
  offer_amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
