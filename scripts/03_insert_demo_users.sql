-- Insert demo users for Your Business House
-- Password for all users: demo123
-- Hashed password: $2a$10$N9qo8uLOickgx2ZMRZoMye (use bcryptjs library for hashing)

INSERT INTO users (email, password, name, role, phone, is_active) VALUES
('asesor@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeLHQzq5u0eOHNQlGqzVNZUIYxQU6Ja3i', 'Carlos Asesor', 'asesor', '+58-212-555-0101', TRUE),
('admin@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeLHQzq5u0eOHNQlGqzVNZUIYxQU6Ja3i', 'María Admin', 'admin', '+58-212-555-0102', TRUE),
('gerencia@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeLHQzq5u0eOHNQlGqzVNZUIYxQU6Ja3i', 'Juan Gerencia', 'gerencia', '+58-212-555-0103', TRUE);

-- Insert sample properties
INSERT INTO properties (title, description, property_type, status, price, location, city, country, bedrooms, bathrooms, area_sqm, garage_spaces, agent_id) VALUES
('Apartamento Moderno Centro', 'Hermoso apartamento en el corazón de la ciudad, totalmente equipado', 'apartamento', 'disponible', 250000.00, 'Avenida Principal 123', 'Caracas', 'Venezuela', 3, 2, 120.50, 1, 1),
('Casa de Lujo Altamira', 'Residencia exclusiva con piscina y jardín privado', 'casa', 'disponible', 500000.00, 'Calle Los Llanos 456', 'Caracas', 'Venezuela', 5, 4, 350.00, 3, 1),
('Oficina Premium Zona Financiera', 'Moderna oficina completamente amueblada', 'oficina', 'alquilado', 150000.00, 'Edificio Empresarial 789', 'Caracas', 'Venezuela', 0, 1, 85.00, 0, 1),
('Terreno en Desarrollo', 'Amplio terreno para proyecto inmobiliario', 'terreno', 'disponible', 200000.00, 'Zona Industrial 321', 'Maracaibo', 'Venezuela', 0, 0, 5000.00, 0, 1);

-- Insert sample contacts
INSERT INTO contacts (name, email, phone, property_id, message, status, assigned_to) VALUES
('Pedro González', 'pedro@example.com', '+58-412-555-0001', 1, 'Interesado en el apartamento', 'interesado', 1),
('Laura Martínez', 'laura@example.com', '+58-414-555-0002', 2, 'Consulta sobre la casa', 'contactado', 1),
('Roberto López', 'roberto@example.com', '+58-416-555-0003', 3, 'Información de la oficina', 'nuevo', 1);

-- Insert sample transactions
INSERT INTO transactions (property_id, buyer_id, agent_id, transaction_type, amount, commission_percentage, commission_amount, status) VALUES
(1, 2, 1, 'compra', 250000.00, 5.00, 12500.00, 'completada'),
(3, 3, 1, 'alquiler', 8000.00, 10.00, 800.00, 'completada');

-- Verify insertion
SELECT 'Demo users created successfully!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_properties FROM properties;
SELECT COUNT(*) as total_contacts FROM contacts;
