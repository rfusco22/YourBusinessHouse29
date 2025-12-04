-- Create database
CREATE DATABASE IF NOT EXISTS your_business_house;
USE your_business_house;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('asesor', 'admin', 'gerencia') NOT NULL DEFAULT 'asesor',
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  property_type ENUM('casa', 'apartamento', 'oficina', 'terreno', 'comercial') NOT NULL,
  status ENUM('disponible', 'alquilado', 'vendido', 'pendiente') NOT NULL DEFAULT 'disponible',
  price DECIMAL(15, 2) NOT NULL,
  rental_price DECIMAL(15, 2),
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bedrooms INT,
  bathrooms INT,
  area_sqm DECIMAL(10, 2),
  garage_spaces INT,
  featured_image_url VARCHAR(500),
  agent_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_property_type (property_type),
  INDEX idx_city (city),
  INDEX idx_agent_id (agent_id)
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property_id (property_id)
);

-- Contacts/Leads table
CREATE TABLE IF NOT EXISTS contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  property_id INT,
  message LONGTEXT,
  status ENUM('nuevo', 'contactado', 'interesado', 'rechazado', 'convertido') NOT NULL DEFAULT 'nuevo',
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_property_id (property_id)
);

-- Sales/Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT,
  agent_id INT NOT NULL,
  transaction_type ENUM('compra', 'alquiler') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  commission_percentage DECIMAL(5, 2),
  commission_amount DECIMAL(15, 2),
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pendiente', 'completada', 'cancelada') NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_agent_id (agent_id),
  INDEX idx_status (status),
  INDEX idx_transaction_type (transaction_type)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, property_id),
  INDEX idx_user_id (user_id)
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INT,
  description LONGTEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);
