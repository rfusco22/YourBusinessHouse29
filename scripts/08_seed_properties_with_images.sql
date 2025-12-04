-- Seed data with 5 properties, each with multiple images
-- This script inserts test properties with full details for development/testing

-- Insert 5 test properties with realistic data
INSERT INTO properties (
  title, 
  description, 
  property_type, 
  status, 
  price, 
  rental_price, 
  location, 
  city, 
  country, 
  bedrooms, 
  bathrooms, 
  area_sqm, 
  garage_spaces, 
  featured_image_url, 
  agent_id,
  approval_status
) VALUES
-- Property 1: Casa moderna en Altamira
(
  'Casa moderna en Altamira',
  'Esta hermosa casa ubicada en la prestigiosa zona de Altamira ofrece lo mejor en diseño moderno y comodidad. Con 250 m² de construcción distribuidos en tres niveles, la propiedad cuenta con amplios espacios luminosos, terminaciones de primera calidad y todas las amenidades que una familia busca. La casa destaca por su arquitectura contemporánea, grandes ventanales que permiten la entrada de luz natural, y una distribución inteligente del espacio. Perfecta para familias que desean vivir en una de las zonas más seguras y exclusivas de Caracas.',
  'casa',
  'pendiente',
  450000.00,
  2000.00,
  'Altamira, Caracas',
  'Caracas',
  'Venezuela',
  4,
  3,
  250.00,
  2,
  '/images/property1-main.jpg',
  1,
  'pendiente'
),
-- Property 2: Apartamento de lujo en La Castellana
(
  'Apartamento de lujo en La Castellana',
  'Espectacular apartamento ubicado en edificio de categoría en La Castellana con acabados premium. El inmueble cuenta con 5 habitaciones, 4 baños completos, cocina gourmet equipada, sala de cine, home office y terraza con vista panorámica a Caracas. Servicios de concierge, piscina olímpica, gym, spa y seguridad 24/7. Un verdadero refugio de lujo y exclusividad.',
  'apartamento',
  'pendiente',
  850000.00,
  3500.00,
  'La Castellana, Caracas',
  'Caracas',
  'Venezuela',
  5,
  4,
  320.00,
  3,
  '/images/property2-main.jpg',
  1,
  'pendiente'
),
-- Property 3: Oficina ejecutiva Downtown
(
  'Oficina ejecutiva en zona premium Downtown',
  'Lujosa oficina ejecutiva de 280 m² ubicada en el corazón de la zona comercial más importante de Caracas. Perfecta para firmas legales, consultorías o empresas de tecnología. Cuenta con salas de reuniones, recepción, espacios de trabajo abiertos y cerrados, kitchen area y estacionamientos privados. Acceso a todas las amenidades del edificio corporativo premium.',
  'oficina',
  'pendiente',
  600000.00,
  3000.00,
  'Downtown Business Center, Caracas',
  'Caracas',
  'Venezuela',
  NULL,
  2,
  280.00,
  2,
  '/images/property3-main.jpg',
  2,
  'pendiente'
),
-- Property 4: Terreno comercial Maracaibo
(
  'Terreno comercial en zona industrial Maracaibo',
  'Extenso terreno de 8000 m² ubicado en zona industrial con excelente acceso vial. Servicios básicos disponibles (agua, electricidad, gas). Ideal para desarrollos comerciales, industriales o inmobiliarios. Zona de alto crecimiento comercial. Ubicación estratégica cercana a centros comerciales y vías principales.',
  'terreno',
  'pendiente',
  300000.00,
  NULL,
  'Zona Industrial, Maracaibo',
  'Maracaibo',
  'Venezuela',
  NULL,
  NULL,
  8000.00,
  NULL,
  '/images/property4-main.jpg',
  2,
  'pendiente'
),
-- Property 5: Apartamento económico Bello Monte
(
  'Apartamento compacto en Bello Monte',
  'Apartamento de 2 habitaciones y 1.5 baños en zona residencial consolidada de Bello Monte. Ideal para inversión o vivienda propia. Cuenta con cocina moderna, sala comedor integrada, balcón y parking. Edificio con servicios, acceso controlado y buena comunidad. Excelente ubicación cercana a comercios, restaurantes y transporte.',
  'apartamento',
  'pendiente',
  180000.00,
  900.00,
  'Bello Monte, Caracas',
  'Caracas',
  'Venezuela',
  2,
  2,
  95.00,
  1,
  '/images/property5-main.jpg',
  3,
  'pendiente'
);

-- Insert multiple images for each property (5 images per property)
-- Property 1 images
INSERT INTO property_images (property_id, image_url, alt_text, display_order) VALUES
(LAST_INSERT_ID()-4, '/images/property1-image1.jpg', 'Fachada principal de la casa', 1),
(LAST_INSERT_ID()-4, '/images/property1-image2.jpg', 'Sala comedor moderna', 2),
(LAST_INSERT_ID()-4, '/images/property1-image3.jpg', 'Cocina gourmet', 3),
(LAST_INSERT_ID()-4, '/images/property1-image4.jpg', 'Dormitorio principal', 4),
(LAST_INSERT_ID()-4, '/images/property1-image5.jpg', 'Piscina y terraza', 5);

-- Property 2 images
INSERT INTO property_images (property_id, image_url, alt_text, display_order) VALUES
(LAST_INSERT_ID()-3, '/images/property2-image1.jpg', 'Vista principal del apartamento', 1),
(LAST_INSERT_ID()-3, '/images/property2-image2.jpg', 'Sala de estar lujosa', 2),
(LAST_INSERT_ID()-3, '/images/property2-image3.jpg', 'Cocina equipada', 3),
(LAST_INSERT_ID()-3, '/images/property2-image4.jpg', 'Dormitorio master suite', 4),
(LAST_INSERT_ID()-3, '/images/property2-image5.jpg', 'Terraza con vista panorámica', 5);

-- Property 3 images
INSERT INTO property_images (property_id, image_url, alt_text, display_order) VALUES
(LAST_INSERT_ID()-2, '/images/property3-image1.jpg', 'Fachada del edificio corporativo', 1),
(LAST_INSERT_ID()-2, '/images/property3-image2.jpg', 'Recepción ejecutiva', 2),
(LAST_INSERT_ID()-2, '/images/property3-image3.jpg', 'Sala de conferencias', 3),
(LAST_INSERT_ID()-2, '/images/property3-image4.jpg', 'Espacio de oficinas', 4),
(LAST_INSERT_ID()-2, '/images/property3-image5.jpg', 'Area de descanso', 5);

-- Property 4 images
INSERT INTO property_images (property_id, image_url, alt_text, display_order) VALUES
(LAST_INSERT_ID()-1, '/images/property4-image1.jpg', 'Vista del terreno desde arriba', 1),
(LAST_INSERT_ID()-1, '/images/property4-image2.jpg', 'Acceso principal terreno', 2),
(LAST_INSERT_ID()-1, '/images/property4-image3.jpg', 'Extensión del terreno', 3),
(LAST_INSERT_ID()-1, '/images/property4-image4.jpg', 'Servicios disponibles', 4),
(LAST_INSERT_ID()-1, '/images/property4-image5.jpg', 'Zona aledaña comercial', 5);

-- Property 5 images
INSERT INTO property_images (property_id, image_url, alt_text, display_order) VALUES
(LAST_INSERT_ID(), '/images/property5-image1.jpg', 'Fachada del edificio', 1),
(LAST_INSERT_ID(), '/images/property5-image2.jpg', 'Sala comedor', 2),
(LAST_INSERT_ID(), '/images/property5-image3.jpg', 'Cocina moderna', 3),
(LAST_INSERT_ID(), '/images/property5-image4.jpg', 'Dormitorio', 4),
(LAST_INSERT_ID(), '/images/property5-image5.jpg', 'Zona común del edificio', 5);
