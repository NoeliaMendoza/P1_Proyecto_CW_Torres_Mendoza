CREATE DATABASE IF NOT EXISTS Proyecto_CW
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE Proyecto_CW;

-- ── Categorías ───────────────────────────────────────────────
CREATE TABLE categorias (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(80)  NOT NULL,
  slug       VARCHAR(80)  NOT NULL UNIQUE,
  imagen_url VARCHAR(255),
  activo     TINYINT(1)   NOT NULL DEFAULT 1
);

-- ── Productos ────────────────────────────────────────────────
CREATE TABLE productos (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT UNSIGNED NOT NULL,
  nombre       VARCHAR(120) NOT NULL,
  descripcion  TEXT,
  precio       DECIMAL(8,2) NOT NULL,
  imagen_url   VARCHAR(255),
  disponible   TINYINT(1)   NOT NULL DEFAULT 1,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- ── Opciones de producto ─────────────────────────────────────
CREATE TABLE producto_opciones (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  producto_id  INT UNSIGNED NOT NULL,
  grupo        VARCHAR(60)  NOT NULL,
  valor        VARCHAR(60)  NOT NULL,
  precio_extra DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ── Administradores ──────────────────────────────────────────
CREATE TABLE admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);

-- ── Pedidos ──────────────────────────────────────────────────
CREATE TABLE pedidos (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente   VARCHAR(120) NOT NULL,
  email_cliente    VARCHAR(150),
  telefono_cliente VARCHAR(20),
  notas            TEXT,
  total            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  estado           ENUM('pendiente','en_proceso','listo','entregado','cancelado')
                   NOT NULL DEFAULT 'pendiente',
  creado_en        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Ítems del pedido ─────────────────────────────────────────
CREATE TABLE pedido_items (
  id           INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  pedido_id    INT UNSIGNED     NOT NULL,
  producto_id  INT UNSIGNED     NOT NULL,
  nombre       VARCHAR(120)     NOT NULL,
  opcion_grupo VARCHAR(60),
  opcion_valor VARCHAR(60),
  precio_unit  DECIMAL(8,2)     NOT NULL,
  cantidad     TINYINT UNSIGNED NOT NULL DEFAULT 1,
  FOREIGN KEY (pedido_id)   REFERENCES pedidos(id)   ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);


-- ============================================================
--  DATOS DE EJEMPLO
-- ============================================================

INSERT INTO categorias (nombre, slug, imagen_url) VALUES
  ('Cafés calientes',  'cafes-calientes',  '/assets/cat-hot.jpg'),
  ('Cafés fríos',      'cafes-frios',      '/assets/cat-cold.jpg'),
  ('Tés e infusiones', 'tes',              '/assets/cat-tea.jpg'),
  ('Batidos y jugos',  'batidos-jugos',    '/assets/cat-drinks.jpg'),
  ('Desayunos',        'desayunos',        '/assets/cat-breakfast.jpg'),
  ('Sándwiches',       'sandwiches',       '/assets/cat-sandwiches.jpg'),
  ('Ensaladas',        'ensaladas',        '/assets/cat-salads.jpg'),
  ('Repostería',       'reposteria',       '/assets/cat-baked.jpg');

INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible) VALUES
  -- Cafés calientes (1)
  (1, 'Espresso',          'Doble shot intenso y aromático.',                   2.50, '/assets/espresso.jpg',      1),
  (1, 'Cappuccino',        'Espresso con leche vaporizada y espuma cremosa.',   3.50, '/assets/cappuccino.jpg',    1),
  (1, 'Latte de vainilla', 'Espresso suave con jarabe de vainilla artesanal.',  4.00, '/assets/latte.jpg',         1),
  (1, 'Americano',         'Espresso diluido en agua caliente.',                2.80, '/assets/americano.jpg',     1),
  (1, 'Mocaccino',         'Espresso con chocolate y leche vaporizada.',        4.20, '/assets/mocaccino.jpg',     1),

  -- Cafés fríos (2)
  (2, 'Cold Brew',         'Extraído en frío 12 h, suave y afrutado.',          4.50, '/assets/coldbrew.jpg',      1),
  (2, 'Frappé Caramelo',   'Cold brew con caramelo y crema batida.',            5.00, '/assets/frappe.jpg',        1),
  (2, 'Iced Latte',        'Espresso sobre hielo con leche fría.',              4.00, '/assets/icedlatte.jpg',     1),

  -- Tés e infusiones (3)
  (3, 'Matcha Latte',      'Matcha ceremonial con leche de avena.',             4.50, '/assets/matcha.jpg',        1),
  (3, 'Chai Latte',        'Especias indias con leche vaporizada.',             4.00, '/assets/chai.jpg',          1),
  (3, 'Té verde',          'Hojas sueltas de té verde japonés.',                2.80, '/assets/te-verde.jpg',      1),
  (3, 'Manzanilla',        'Infusión relajante de manzanilla con miel.',        2.50, '/assets/manzanilla.jpg',    1),

  -- Batidos y jugos (4)
  (4, 'Batido de fresa',   'Fresas frescas con leche y un toque de vainilla.', 4.50, '/assets/batido-fresa.jpg',  1),
  (4, 'Jugo de naranja',   'Naranja exprimida al momento.',                    3.00, '/assets/jugo-naranja.jpg',  1),
  (4, 'Smoothie verde',    'Espinaca, mango, plátano y leche de coco.',        5.00, '/assets/smoothie.jpg',      1),

  -- Desayunos (5)
  (5, 'Tostadas con aguacate', 'Pan artesanal, aguacate, tomate cherry y sal marina.', 6.50, '/assets/tostadas-aguacate.jpg', 1),
  (5, 'Granola con yogur',     'Granola casera con yogur griego y frutos rojos.',       5.50, '/assets/granola.jpg',          1),
  (5, 'Huevos revueltos',      'Dos huevos con tostada y jugo de naranja.',             7.00, '/assets/huevos.jpg',           1),
  (5, 'Pancakes',              'Tres pancakes esponjosos con miel y mantequilla.',      6.00, '/assets/pancakes.jpg',         1),

  -- Sándwiches (6)
  (6, 'Sándwich de pollo',  'Pechuga a la plancha, lechuga, tomate y mayonesa.',  6.50, '/assets/sandwich-pollo.jpg', 1),
  (6, 'Club vegetal',       'Queso brie, rúcula, tomate seco y pesto.',           6.00, '/assets/club-vegetal.jpg',   1),
  (6, 'BLT',                'Bacon, lechuga, tomate y mostaza en pan ciabatta.',  6.80, '/assets/blt.jpg',            1),

  -- Ensaladas (7)
  (7, 'Ensalada César',    'Romana, pollo, crutones y aderezo César casero.',    7.50, '/assets/cesar.jpg',         1),
  (7, 'Ensalada caprese',  'Tomate, mozzarella fresca, albahaca y aceite.',      6.50, '/assets/caprese.jpg',       1),

  -- Repostería (8)
  (8, 'Croissant',          'Mantequilla francesa, horneado a diario.',          2.80, '/assets/croissant.jpg',     1),
  (8, 'Muffin de arándano', 'Esponjoso con arándanos frescos.',                  2.50, '/assets/muffin.jpg',        1),
  (8, 'Brownie',            'Chocolate belga, denso y fudgy.',                   3.00, '/assets/brownie.jpg',       1),
  (8, 'Cheesecake',         'Base de galleta, relleno cremoso y mermelada.',     4.00, '/assets/cheesecake.jpg',    1),
  (8, 'Banana bread',       'Bizcocho húmedo de plátano con nueces.',            3.20, '/assets/banana-bread.jpg',  1);

-- Opciones para bebidas y comidas seleccionadas
INSERT INTO producto_opciones (producto_id, grupo, valor, precio_extra) VALUES
  -- Cappuccino (2)
  (2, 'Tamaño', 'Pequeño',  0.00), (2, 'Tamaño', 'Mediano', 0.50), (2, 'Tamaño', 'Grande', 1.00),
  (2, 'Leche',  'Entera',   0.00), (2, 'Leche',  'Avena',   0.60), (2, 'Leche',  'Almendra', 0.60),
  -- Latte de vainilla (3)
  (3, 'Tamaño', 'Mediano',  0.00), (3, 'Tamaño', 'Grande',  0.80),
  (3, 'Leche',  'Entera',   0.00), (3, 'Leche',  'Avena',   0.60), (3, 'Leche',  'Almendra', 0.60),
  -- Cold Brew (6)
  (6, 'Tamaño', 'Regular',  0.00), (6, 'Tamaño', 'Grande',  1.20),
  -- Matcha Latte (9)
  (9, 'Leche',  'Avena',    0.00), (9, 'Leche',  'Almendra', 0.60),
  -- Sándwiches: tipo de pan (20, 21, 22)
  (20, 'Pan', 'Ciabatta',   0.00), (20, 'Pan', 'Integral',  0.00), (20, 'Pan', 'Sin gluten', 0.80),
  (21, 'Pan', 'Ciabatta',   0.00), (21, 'Pan', 'Integral',  0.00), (21, 'Pan', 'Sin gluten', 0.80),
  (22, 'Pan', 'Ciabatta',   0.00), (22, 'Pan', 'Integral',  0.00), (22, 'Pan', 'Sin gluten', 0.80),
  -- Ensalada César: proteína (23)
  (23, 'Proteína', 'Con pollo', 0.00), (23, 'Proteína', 'Sin pollo', -1.00),
  -- Pancakes: extra (19)
  (19, 'Extra', 'Frutos rojos', 1.00), (19, 'Extra', 'Nutella', 1.20);

-- Admin por defecto: admin@proyecto.com / Admin123!
INSERT INTO admins (nombre, email, password_hash) VALUES
  ('Admin', 'admin@proyecto.com',
   '$2b$10$wYqLa3Bz/YbS3kR2R8HqP.Tgk5JHf6cWmJaBHdVWEbZs.I3E4xVi2');