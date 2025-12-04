-- Insert demo users
INSERT INTO users (email, password, name, role, phone) VALUES
('asesor@test.com', 'demo123', 'Juan Asesor García', 'asesor', '+58-2123456789'),
('admin@test.com', 'demo123', 'María Admin López', 'admin', '+58-2129876543'),
('gerencia@test.com', 'demo123', 'Carlos Gerencia Martín', 'gerencia', '+58-2125555555'),
('asesor2@test.com', 'demo123', 'Laura Asesor Rodríguez', 'asesor', '+58-2124443333');

-- Insert demo properties
INSERT INTO properties (title, description, property_type, status, price, rental_price, location, city, country, bedrooms, bathrooms, area_sqm, garage_spaces, agent_id) VALUES
('Apartamento Moderno en Altamira', 'Hermoso apartamento de 3 habitaciones con vista a la ciudad, piscina y gym.', 'apartamento', 'disponible', 350000.00, 1500.00, 'Altamira, Caracas', 'Caracas', 'Venezuela', 3, 2, 150.00, 2, 1),
('Casa de Lujo en La Castellana', 'Residencia de alta gama con 4 habitaciones, jardín y piscina privada.', 'casa', 'disponible', 750000.00, 3000.00, 'La Castellana', 'Caracas', 'Venezuela', 4, 3, 300.00, 3, 1),
('Oficina Premium Downtown', 'Oficina ejecutiva de 200m2 en zona comercial premium.', 'oficina', 'disponible', 500000.00, 2500.00, 'Downtown Business', 'Caracas', 'Venezuela', NULL, 2, 200.00, 1, 2),
('Terreno Comercial Maracaibo', 'Terreno de 5000m2 con servicios, ideal para desarrollo comercial.', 'terreno', 'disponible', 200000.00, NULL, 'Zona Industrial', 'Maracaibo', 'Venezuela', NULL, NULL, 5000.00, NULL, 2),
('Apartamento Económico Bello Monte', 'Compacto apartamento de 2 habitaciones para inversión.', 'apartamento', 'disponible', 150000.00, 800.00, 'Bello Monte', 'Caracas', 'Venezuela', 2, 1, 80.00, 1, 3);

-- Insert property images
INSERT INTO property_images (property_id, image_url, alt_text, display_order) VALUES
(1, '/placeholder.svg?height=600&width=800', 'Vista principal', 0),
(1, '/placeholder.svg?height=600&width=800', 'Sala', 1),
(2, '/placeholder.svg?height=600&width=800', 'Fachada casa', 0),
(3, '/placeholder.svg?height=600&width=800', 'Oficina ejecutiva', 0),
(4, '/placeholder.svg?height=600&width=800', 'Terreno', 0),
(5, '/placeholder.svg?height=600&width=800', 'Apartamento', 0);

-- Insert demo contacts
INSERT INTO contacts (name, email, phone, property_id, message, status, assigned_to) VALUES
('Juan Pérez', 'juan@example.com', '+58-4121234567', 1, 'Interesado en visitar el apartamento', 'interesado', 1),
('María González', 'maria@example.com', '+58-4125555555', 2, 'Consultando disponibilidad', 'nuevo', 1),
('Pedro Sánchez', 'pedro@example.com', '+58-4129999999', 3, 'Necesito más información', 'contactado', 2);
