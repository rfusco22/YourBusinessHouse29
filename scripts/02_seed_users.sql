-- Insert demo users into the users table
-- Passwords are hashed with bcrypt (cost: 10)

INSERT INTO users (email, password, name, role, phone, is_active) VALUES
('asesor@test.com', '$2a$10$YourHashedPasswordHere1', 'Juan Asesor', 'asesor', '+58-212-1234567', TRUE),
('admin@test.com', '$2a$10$YourHashedPasswordHere2', 'María Admin', 'admin', '+58-212-2345678', TRUE),
('gerencia@test.com', '$2a$10$YourHashedPasswordHere3', 'Carlos Gerencia', 'gerencia', '+58-212-3456789', TRUE);

-- Note: The passwords above are placeholders. To generate proper bcrypt hashes:
-- 1. Use an online bcrypt generator or Node.js to hash passwords
-- 2. For testing, you can use these credentials with their hashed versions
-- 3. The password for all demo users is: demo123
