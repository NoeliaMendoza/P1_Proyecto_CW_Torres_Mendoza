CREATE DATABASE IF NOT EXISTS proyecto_cw CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci;

USE proyecto_cw;

-- ── Usuarios ─────────────────────────────────────────────────
-- rol: 'cliente' para clientes registrados, 'admin' para administradores
CREATE TABLE
  usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM ('cliente', 'admin') NOT NULL DEFAULT 'cliente',
    activo TINYINT (1) NOT NULL DEFAULT 1,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- ── Categorías ───────────────────────────────────────────────
CREATE TABLE
  categorias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    slug VARCHAR(80) NOT NULL UNIQUE,
    imagen_url VARCHAR(255),
    activo TINYINT (1) NOT NULL DEFAULT 1
  );

-- ── Productos ────────────────────────────────────────────────
CREATE TABLE
  productos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(8, 2) NOT NULL,
    imagen_url VARCHAR(255),
    disponible TINYINT (1) NOT NULL DEFAULT 1,
    INDEX idx_categoria (categoria_id),
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
  );

-- ── Opciones de producto ─────────────────────────────────────
CREATE TABLE
  producto_opciones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    producto_id INT UNSIGNED NOT NULL,
    grupo VARCHAR(60) NOT NULL,
    valor VARCHAR(60) NOT NULL,
    precio_extra DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    INDEX idx_producto (producto_id),
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
  );

-- ── Pedidos ──────────────────────────────────────────────────
-- usuario_id NULL = pedido como invitado sin cuenta
-- atendido_por NULL = aún sin admin asignado
CREATE TABLE
  pedidos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED,
    atendido_por INT UNSIGNED,
    nombre_cliente VARCHAR(120) NOT NULL,
    email_cliente VARCHAR(150),
    telefono_cliente VARCHAR(20),
    notas TEXT,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    estado ENUM (
      'pendiente',
      'en_proceso',
      'listo',
      'entregado',
      'cancelado'
    ) NOT NULL DEFAULT 'pendiente',
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario_id),
    INDEX idx_admin (atendido_por),
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL,
    FOREIGN KEY (atendido_por) REFERENCES usuarios (id) ON DELETE SET NULL
  );

-- ── Ítems del pedido ─────────────────────────────────────────
CREATE TABLE
  pedido_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT UNSIGNED NOT NULL,
    producto_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    opcion_grupo VARCHAR(60),
    opcion_valor VARCHAR(60),
    precio_unit DECIMAL(8, 2) NOT NULL,
    cantidad TINYINT UNSIGNED NOT NULL DEFAULT 1,
    INDEX idx_pedido (pedido_id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE RESTRICT
  );

-- ============================================================
--  DATOS DE EJEMPLO
-- ============================================================
-- Categorías
INSERT INTO
  categorias (nombre, slug, imagen_url)
VALUES
  (
    'Café',
    'cafe',
    'https://i.pinimg.com/736x/b3/c2/ca/b3c2cad3c7c54c458ce05ed7efb4e017.jpg'
  ),
  (
    'Bebidas Frías',
    'bebidas-frias',
    'https://i.pinimg.com/736x/97/6f/e7/976fe7d600238d377e398a77cd45bd51.jpg'
  ),
  (
    'Pasteles',
    'pasteles',
    'https://i.pinimg.com/1200x/91/43/f0/9143f0ffd9a32e20853564cc45a83150.jpg'
  ),
  (
    'Té',
    'te',
    'https://i.pinimg.com/736x/27/a8/4d/27a84dcfb3e55fb97f51c7211d48b822.jpg'
  ),
  (
    'Batidos y Jugos',
    'batidos-jugos',
    'https://i.pinimg.com/736x/4a/d9/de/4ad9de42a38dbd9726ec2122b603771f.jpg'
  ),
  (
    'Postres',
    'postres',
    'https://i.pinimg.com/736x/a6/54/c6/a654c6635a39dd0dbb6e983f17850cae.jpg'
  ),
  (
    'Desayunos',
    'desayunos',
    'https://i.pinimg.com/736x/15/e4/da/15e4daaa12c438ecd87bd39a10d6983e.jpg'
  ),
  (
    'Sándwiches',
    'sandwiches',
    'https://i.pinimg.com/1200x/3d/fe/06/3dfe06d1246cab07ea7363baa5979352.jpg'
  );

-- Productos
INSERT INTO
  productos (
    categoria_id,
    nombre,
    descripcion,
    precio,
    imagen_url
  )
VALUES
  (
    1,
    'Espresso',
    'Café espresso tradicional',
    2.50,
    'https://example.com/espresso.jpg'
  ),
  (
    1,
    'Cappuccino',
    'Café con leche espumosa',
    3.00,
    'https://example.com/cappuccino.jpg'
  ),
  (
    2,
    'Café Helado',
    'Café frío refrescante',
    3.50,
    'https://example.com/cafe-helado.jpg'
  ),
  (
    3,
    'Torta de Chocolate',
    'Deliciosa torta de chocolate',
    4.00,
    'https://example.com/torta-chocolate.jpg'
  );

-- Usuarios
INSERT INTO
  usuarios (nombre, email, password_hash, telefono, rol)
VALUES
  (
    'Admin',
    'admin@martascoffee.com',
    '$2b$10$wYqLa3Bz/YbS3kR2R8HqP.Tgk5JHf6cWmJaBHdVWEbZs.I3E4xVi2',
    NULL,
    'admin'
  ),
  (
    'María López',
    'maria@martascoffee.com',
    '$2b$10$wYqLa3Bz/YbS3kR2R8HqP.Tgk5JHf6cWmJaBHdVWEbZs.I3E4xVi2',
    NULL,
    'admin'
  ),
  (
    'Ana Torres',
    'ana@example.com',
    '$2b$10$wYqLa3Bz/YbS3kR2R8HqP.Tgk5JHf6cWmJaBHdVWEbZs.I3E4xVi2',
    '0991234567',
    'cliente'
  ),
  (
    'Luis Mora',
    'luis@example.com',
    '$2b$10$wYqLa3Bz/YbS3kR2R8HqP.Tgk5JHf6cWmJaBHdVWEbZs.I3E4xVi2',
    '0987654321',
    'cliente'
  ),
  (
    'Sara Pérez',
    'sara@example.com',
    '$2b$10$wYqLa3Bz/YbS3kR2R8HqP.Tgk5JHf6cWmJaBHdVWEbZs.I3E4xVi2',
    NULL,
    'cliente'
  );

INSERT INTO
  categorias (nombre, slug, imagen_url)
VALUES
  (
    'Cafés calientes',
    'cafes-calientes',
    '/assets/cat-hot.jpg'
  ),
  (
    'Cafés fríos',
    'cafes-frios',
    '/assets/cat-cold.jpg'
  ),
  ('Tés e infusiones', 'tes', '/assets/cat-tea.jpg'),
  (
    'Batidos y jugos',
    'batidos-jugos',
    '/assets/cat-drinks.jpg'
  ),
  (
    'Desayunos',
    'desayunos',
    '/assets/cat-breakfast.jpg'
  ),
  (
    'Sándwiches',
    'sandwiches',
    '/assets/cat-sandwiches.jpg'
  ),
  (
    'Ensaladas',
    'ensaladas',
    '/assets/cat-salads.jpg'
  ),
  (
    'Repostería',
    'reposteria',
    '/assets/cat-baked.jpg'
  );

INSERT INTO
  productos (
    categoria_id,
    nombre,
    descripcion,
    precio,
    imagen_url,
    disponible
  )
VALUES
  -- Cafés calientes (1)
  (
    1,
    'Espresso',
    'Doble shot intenso y aromático.',
    2.50,
    '/assets/espresso.jpg',
    1
  ),
  (
    1,
    'Cappuccino',
    'Espresso con leche vaporizada y espuma cremosa.',
    3.50,
    '/assets/cappuccino.jpg',
    1
  ),
  (
    1,
    'Latte de vainilla',
    'Espresso suave con jarabe de vainilla artesanal.',
    4.00,
    '/assets/latte.jpg',
    1
  ),
  (
    1,
    'Americano',
    'Espresso diluido en agua caliente.',
    2.80,
    '/assets/americano.jpg',
    1
  ),
  (
    1,
    'Mocaccino',
    'Espresso con chocolate y leche vaporizada.',
    4.20,
    '/assets/mocaccino.jpg',
    1
  ),
  -- Cafés fríos (2)
  (
    2,
    'Cold Brew',
    'Extraído en frío 12 h, suave y afrutado.',
    4.50,
    '/assets/coldbrew.jpg',
    1
  ),
  (
    2,
    'Frappé Caramelo',
    'Cold brew con caramelo y crema batida.',
    5.00,
    '/assets/frappe.jpg',
    1
  ),
  (
    2,
    'Iced Latte',
    'Espresso sobre hielo con leche fría.',
    4.00,
    '/assets/icedlatte.jpg',
    1
  ),
  -- Tés e infusiones (3)
  (
    3,
    'Matcha Latte',
    'Matcha ceremonial con leche de avena.',
    4.50,
    '/assets/matcha.jpg',
    1
  ),
  (
    3,
    'Chai Latte',
    'Especias indias con leche vaporizada.',
    4.00,
    '/assets/chai.jpg',
    1
  ),
  (
    3,
    'Té verde',
    'Hojas sueltas de té verde japonés.',
    2.80,
    '/assets/te-verde.jpg',
    1
  ),
  (
    3,
    'Manzanilla',
    'Infusión relajante de manzanilla con miel.',
    2.50,
    '/assets/manzanilla.jpg',
    1
  ),
  -- Batidos y jugos (4)
  (
    4,
    'Batido de fresa',
    'Fresas frescas con leche y un toque de vainilla.',
    4.50,
    '/assets/batido-fresa.jpg',
    1
  ),
  (
    4,
    'Jugo de naranja',
    'Naranja exprimida al momento.',
    3.00,
    '/assets/jugo-naranja.jpg',
    1
  ),
  (
    4,
    'Smoothie verde',
    'Espinaca, mango, plátano y leche de coco.',
    5.00,
    '/assets/smoothie.jpg',
    1
  ),
  -- Desayunos (5)
  (
    5,
    'Tostadas con aguacate',
    'Pan artesanal, aguacate, tomate cherry y sal marina.',
    6.50,
    '/assets/tostadas-aguacate.jpg',
    1
  ),
  (
    5,
    'Granola con yogur',
    'Granola casera con yogur griego y frutos rojos.',
    5.50,
    '/assets/granola.jpg',
    1
  ),
  (
    5,
    'Huevos revueltos',
    'Dos huevos con tostada y jugo de naranja.',
    7.00,
    '/assets/huevos.jpg',
    1
  ),
  (
    5,
    'Pancakes',
    'Tres pancakes esponjosos con miel y mantequilla.',
    6.00,
    '/assets/pancakes.jpg',
    1
  ),
  -- Sándwiches (6)
  (
    6,
    'Sándwich de pollo',
    'Pechuga a la plancha, lechuga, tomate y mayonesa.',
    6.50,
    '/assets/sandwich-pollo.jpg',
    1
  ),
  (
    6,
    'Club vegetal',
    'Queso brie, rúcula, tomate seco y pesto.',
    6.00,
    '/assets/club-vegetal.jpg',
    1
  ),
  (
    6,
    'BLT',
    'Bacon, lechuga, tomate y mostaza en pan ciabatta.',
    6.80,
    '/assets/blt.jpg',
    1
  ),
  -- Ensaladas (7)
  (
    7,
    'Ensalada César',
    'Romana, pollo, crutones y aderezo César casero.',
    7.50,
    '/assets/cesar.jpg',
    1
  ),
  (
    7,
    'Ensalada caprese',
    'Tomate, mozzarella fresca, albahaca y aceite.',
    6.50,
    '/assets/caprese.jpg',
    1
  ),
  -- Repostería (8)
  (
    8,
    'Croissant',
    'Mantequilla francesa, horneado a diario.',
    2.80,
    '/assets/croissant.jpg',
    1
  ),
  (
    8,
    'Muffin de arándano',
    'Esponjoso con arándanos frescos.',
    2.50,
    '/assets/muffin.jpg',
    1
  ),
  (
    8,
    'Brownie',
    'Chocolate belga, denso y fudgy.',
    3.00,
    '/assets/brownie.jpg',
    1
  ),
  (
    8,
    'Cheesecake',
    'Base de galleta, relleno cremoso y mermelada.',
    4.00,
    '/assets/cheesecake.jpg',
    1
  ),
  (
    8,
    'Banana bread',
    'Bizcocho húmedo de plátano con nueces.',
    3.20,
    '/assets/banana-bread.jpg',
    1
  );

INSERT INTO
  producto_opciones (producto_id, grupo, valor, precio_extra)
VALUES
  (2, 'Tamaño', 'Pequeño', 0.00),
  (2, 'Tamaño', 'Mediano', 0.50),
  (2, 'Tamaño', 'Grande', 1.00),
  (2, 'Leche', 'Entera', 0.00),
  (2, 'Leche', 'Avena', 0.60),
  (2, 'Leche', 'Almendra', 0.60),
  (3, 'Tamaño', 'Mediano', 0.00),
  (3, 'Tamaño', 'Grande', 0.80),
  (3, 'Leche', 'Entera', 0.00),
  (3, 'Leche', 'Avena', 0.60),
  (3, 'Leche', 'Almendra', 0.60),
  (6, 'Tamaño', 'Regular', 0.00),
  (6, 'Tamaño', 'Grande', 1.20),
  (9, 'Leche', 'Avena', 0.00),
  (9, 'Leche', 'Almendra', 0.60),
  (20, 'Pan', 'Ciabatta', 0.00),
  (20, 'Pan', 'Integral', 0.00),
  (20, 'Pan', 'Sin gluten', 0.80),
  (21, 'Pan', 'Ciabatta', 0.00),
  (21, 'Pan', 'Integral', 0.00),
  (21, 'Pan', 'Sin gluten', 0.80),
  (22, 'Pan', 'Ciabatta', 0.00),
  (22, 'Pan', 'Integral', 0.00),
  (22, 'Pan', 'Sin gluten', 0.80),
  (23, 'Proteína', 'Con pollo', 0.00),
  (23, 'Proteína', 'Sin pollo', -1.00),
  (19, 'Extra', 'Frutos rojos', 1.00),
  (19, 'Extra', 'Nutella', 1.20);

-- Pedidos de ejemplo
-- usuario 3 = Ana (cliente), atendido por usuario 2 = María (admin)
-- usuario 4 = Luis (cliente), sin admin asignado aún
-- NULL = invitado sin cuenta
INSERT INTO
  pedidos (
    usuario_id,
    atendido_por,
    nombre_cliente,
    email_cliente,
    telefono_cliente,
    total,
    estado
  )
VALUES
  (
    3,
    2,
    'Ana Torres',
    'ana@example.com',
    '0991234567',
    7.70,
    'entregado'
  ),
  (
    4,
    1,
    'Luis Mora',
    'luis@example.com',
    '0987654321',
    5.00,
    'en_proceso'
  ),
  (
    NULL,
    NULL,
    'Cliente invitado',
    NULL,
    NULL,
    3.50,
    'pendiente'
  );

INSERT INTO
  pedido_items (
    pedido_id,
    producto_id,
    nombre,
    opcion_grupo,
    opcion_valor,
    precio_unit,
    cantidad
  )
VALUES
  (1, 2, 'Cappuccino', 'Tamaño', 'Grande', 4.50, 1),
  (1, 29, 'Banana bread', NULL, NULL, 3.20, 1),
  (2, 6, 'Cold Brew', 'Tamaño', 'Grande', 5.00, 1),
  (3, 2, 'Cappuccino', 'Tamaño', 'Mediano', 3.50, 1);