-- Simple script to create users table and insert demo users
-- Run this directly in Railway MySQL

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('asesor', 'admin', 'gerencia') NOT NULL DEFAULT 'asesor',
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Delete existing users (for fresh start)
DELETE FROM users WHERE email IN ('asesor@test.com', 'admin@test.com', 'gerencia@test.com');

-- Insert demo users with password hash for 'demo123'
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeLHQzq5u0eOHNQlGqzVNZUIYxQU6Ja3i
INSERT INTO users (email, password, name, role, phone, is_active) VALUES
('asesor@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeLHQzq5u0eOHNQlGqzVNZUIYxQU6Ja3i', 'Carlos Asesor', 'asesor', '+58-212-555-0101', TRUE),
('admin@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeLHQzq5u0eOHNQlGqzVNZUIYxQU6Ja3i', 'María Admin', 'admin', '+58-212-555-0102', TRUE),
('gerencia@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeLHQzq5u0eOHNQlGqzVNZUIYxQU6Ja3i', 'Juan Gerencia', 'gerencia', '+58-212-555-0103', TRUE);

-- Verify
SELECT 'Users created successfully!' as status;
SELECT * FROM users;
