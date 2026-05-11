-- importa la base de datos antes de todo
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-05-2026 a las 05:46:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12
SET
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET
  time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto_cw`
--
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `categorias`
--
CREATE TABLE
  `categorias` (
    `id` int (10) UNSIGNED NOT NULL,
    `nombre` varchar(80) NOT NULL,
    `slug` varchar(80) NOT NULL,
    `imagen_url` varchar(255) DEFAULT NULL,
    `activo` tinyint (1) NOT NULL DEFAULT 1
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--
INSERT INTO
  `categorias` (`id`, `nombre`, `slug`, `imagen_url`, `activo`)
VALUES
  (
    1,
    'Café',
    'cafes-calientes',
    'https://i.pinimg.com/736x/b3/c2/ca/b3c2cad3c7c54c458ce05ed7efb4e017.jpg',
    1
  ),
  (
    2,
    'Bebidas Frías',
    'cafes-frios',
    'https://i.pinimg.com/736x/97/6f/e7/976fe7d600238d377e398a77cd45bd51.jpg',
    1
  ),
  (
    3,
    'Pasteles',
    'tes',
    'https://i.pinimg.com/1200x/91/43/f0/9143f0ffd9a32e20853564cc45a83150.jpg',
    1
  ),
  (
    4,
    'Té',
    'batidos-jugos',
    'https://i.pinimg.com/736x/27/a8/4d/27a84dcfb3e55fb97f51c7211d48b822.jpg',
    1
  ),
  (
    5,
    'Batidos y Jugos',
    'desayunos',
    'https://i.pinimg.com/736x/4a/d9/de/4ad9de42a38dbd9726ec2122b603771f.jpg',
    1
  ),
  (
    6,
    'Postres',
    'sandwiches',
    'https://i.pinimg.com/736x/a6/54/c6/a654c6635a39dd0dbb6e983f17850cae.jpg',
    1
  ),
  (
    7,
    'Desayunos',
    'ensaladas',
    'https://i.pinimg.com/736x/15/e4/da/15e4daaa12c438ecd87bd39a10d6983e.jpg',
    1
  ),
  (
    8,
    'Sándwiches',
    'reposteria',
    'https://i.pinimg.com/1200x/3d/fe/06/3dfe06d1246cab07ea7363baa5979352.jpg',
    1
  );

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `pedidos`
--
CREATE TABLE
  `pedidos` (
    `id` int (10) UNSIGNED NOT NULL,
    `usuario_id` int (10) UNSIGNED DEFAULT NULL,
    `atendido_por` int (10) UNSIGNED DEFAULT NULL,
    `nombre_cliente` varchar(120) NOT NULL,
    `email_cliente` varchar(150) DEFAULT NULL,
    `telefono_cliente` varchar(20) DEFAULT NULL,
    `notas` text DEFAULT NULL,
    `total` decimal(10, 2) NOT NULL DEFAULT 0.00,
    `estado` enum (
      'pendiente',
      'en_proceso',
      'listo',
      'entregado',
      'cancelado'
    ) NOT NULL DEFAULT 'pendiente',
    `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedidos`
--
INSERT INTO
  `pedidos` (
    `id`,
    `usuario_id`,
    `atendido_por`,
    `nombre_cliente`,
    `email_cliente`,
    `telefono_cliente`,
    `notas`,
    `total`,
    `estado`,
    `creado_en`
  )
VALUES
  (
    1,
    3,
    2,
    'Ana Torres',
    'ana@example.com',
    '0991234567',
    NULL,
    7.70,
    'entregado',
    '2026-05-02 03:11:44'
  ),
  (
    2,
    4,
    1,
    'Luis Mora',
    'luis@example.com',
    '0987654321',
    NULL,
    5.00,
    'en_proceso',
    '2026-05-02 03:11:44'
  ),
  (
    3,
    NULL,
    NULL,
    'Cliente invitado',
    NULL,
    NULL,
    NULL,
    3.50,
    'pendiente',
    '2026-05-02 03:11:44'
  );

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `pedido_items`
--
CREATE TABLE
  `pedido_items` (
    `id` int (10) UNSIGNED NOT NULL,
    `pedido_id` int (10) UNSIGNED NOT NULL,
    `producto_id` int (10) UNSIGNED NOT NULL,
    `nombre` varchar(120) NOT NULL,
    `opcion_grupo` varchar(60) DEFAULT NULL,
    `opcion_valor` varchar(60) DEFAULT NULL,
    `precio_unit` decimal(8, 2) NOT NULL,
    `cantidad` tinyint (3) UNSIGNED NOT NULL DEFAULT 1
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedido_items`
--
INSERT INTO
  `pedido_items` (
    `id`,
    `pedido_id`,
    `producto_id`,
    `nombre`,
    `opcion_grupo`,
    `opcion_valor`,
    `precio_unit`,
    `cantidad`
  )
VALUES
  (
    1,
    1,
    2,
    'Cappuccino',
    'Tamaño',
    'Grande',
    4.50,
    1
  ),
  (2, 1, 29, 'Banana bread', NULL, NULL, 3.20, 1),
  (3, 2, 6, 'Cold Brew', 'Tamaño', 'Grande', 5.00, 1),
  (
    4,
    3,
    2,
    'Cappuccino',
    'Tamaño',
    'Mediano',
    3.50,
    1
  );

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `productos`
--
CREATE TABLE
  `productos` (
    `id` int (10) UNSIGNED NOT NULL,
    `categoria_id` int (10) UNSIGNED NOT NULL,
    `nombre` varchar(120) NOT NULL,
    `descripcion` text DEFAULT NULL,
    `precio` decimal(8, 2) NOT NULL,
    `imagen_url` varchar(255) DEFAULT NULL,
    `disponible` tinyint (1) NOT NULL DEFAULT 1
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--
INSERT INTO
  `productos` (
    `id`,
    `categoria_id`,
    `nombre`,
    `descripcion`,
    `precio`,
    `imagen_url`,
    `disponible`
  )
VALUES
  (
    1,
    1,
    'Espresso',
    'Doble shot intenso y aromático.',
    2.50,
    '/assets/espresso.jpg',
    1
  ),
  (
    2,
    1,
    'Cappuccino',
    'Espresso con leche vaporizada y espuma cremosa.',
    3.50,
    '/assets/cappuccino.jpg',
    1
  ),
  (
    3,
    1,
    'Latte de vainilla',
    'Espresso suave con jarabe de vainilla artesanal.',
    4.00,
    '/assets/latte.jpg',
    1
  ),
  (
    4,
    1,
    'Americano',
    'Espresso diluido en agua caliente.',
    2.80,
    '/assets/americano.jpg',
    1
  ),
  (
    5,
    1,
    'Mocaccino',
    'Espresso con chocolate y leche vaporizada.',
    4.20,
    '/assets/mocaccino.jpg',
    1
  ),
  (
    6,
    2,
    'Cold Brew',
    'Extraído en frío 12 h, suave y afrutado.',
    4.50,
    '/assets/coldbrew.jpg',
    1
  ),
  (
    7,
    2,
    'Frappé Caramelo',
    'Cold brew con caramelo y crema batida.',
    5.00,
    '/assets/frappe.jpg',
    1
  ),
  (
    8,
    2,
    'Iced Latte',
    'Espresso sobre hielo con leche fría.',
    4.00,
    '/assets/icedlatte.jpg',
    1
  ),
  (
    9,
    3,
    'Matcha Latte',
    'Matcha ceremonial con leche de avena.',
    4.50,
    '/assets/matcha.jpg',
    1
  ),
  (
    10,
    3,
    'Chai Latte',
    'Especias indias con leche vaporizada.',
    4.00,
    '/assets/chai.jpg',
    1
  ),
  (
    11,
    3,
    'Té verde',
    'Hojas sueltas de té verde japonés.',
    2.80,
    '/assets/te-verde.jpg',
    1
  ),
  (
    12,
    3,
    'Manzanilla',
    'Infusión relajante de manzanilla con miel.',
    2.50,
    '/assets/manzanilla.jpg',
    1
  ),
  (
    13,
    4,
    'Batido de fresa',
    'Fresas frescas con leche y un toque de vainilla.',
    4.50,
    '/assets/batido-fresa.jpg',
    1
  ),
  (
    14,
    4,
    'Jugo de naranja',
    'Naranja exprimida al momento.',
    3.00,
    '/assets/jugo-naranja.jpg',
    1
  ),
  (
    15,
    4,
    'Smoothie verde',
    'Espinaca, mango, plátano y leche de coco.',
    5.00,
    '/assets/smoothie.jpg',
    1
  ),
  (
    16,
    5,
    'Tostadas con aguacate',
    'Pan artesanal, aguacate, tomate cherry y sal marina.',
    6.50,
    '/assets/tostadas-aguacate.jpg',
    1
  ),
  (
    17,
    5,
    'Granola con yogur',
    'Granola casera con yogur griego y frutos rojos.',
    5.50,
    '/assets/granola.jpg',
    1
  ),
  (
    18,
    5,
    'Huevos revueltos',
    'Dos huevos con tostada y jugo de naranja.',
    7.00,
    '/assets/huevos.jpg',
    1
  ),
  (
    19,
    5,
    'Pancakes',
    'Tres pancakes esponjosos con miel y mantequilla.',
    6.00,
    '/assets/pancakes.jpg',
    1
  ),
  (
    20,
    6,
    'Sándwich de pollo',
    'Pechuga a la plancha, lechuga, tomate y mayonesa.',
    6.50,
    '/assets/sandwich-pollo.jpg',
    1
  ),
  (
    21,
    6,
    'Club vegetal',
    'Queso brie, rúcula, tomate seco y pesto.',
    6.00,
    '/assets/club-vegetal.jpg',
    1
  ),
  (
    22,
    6,
    'BLT',
    'Bacon, lechuga, tomate y mostaza en pan ciabatta.',
    6.80,
    '/assets/blt.jpg',
    1
  ),
  (
    23,
    7,
    'Ensalada César',
    'Romana, pollo, crutones y aderezo César casero.',
    7.50,
    '/assets/cesar.jpg',
    1
  ),
  (
    24,
    7,
    'Ensalada caprese',
    'Tomate, mozzarella fresca, albahaca y aceite.',
    6.50,
    '/assets/caprese.jpg',
    1
  ),
  (
    25,
    8,
    'Croissant',
    'Mantequilla francesa, horneado a diario.',
    2.80,
    '/assets/croissant.jpg',
    1
  ),
  (
    26,
    8,
    'Muffin de arándano',
    'Esponjoso con arándanos frescos.',
    2.50,
    '/assets/muffin.jpg',
    1
  ),
  (
    27,
    8,
    'Brownie',
    'Chocolate belga, denso y fudgy.',
    3.00,
    '/assets/brownie.jpg',
    1
  ),
  (
    28,
    8,
    'Cheesecake',
    'Base de galleta, relleno cremoso y mermelada.',
    4.00,
    '/assets/cheesecake.jpg',
    1
  ),
  (
    29,
    8,
    'Banana bread',
    'Bizcocho húmedo de plátano con nueces.',
    3.20,
    '/assets/banana-bread.jpg',
    1
  );

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `producto_opciones`
--
CREATE TABLE
  `producto_opciones` (
    `id` int (10) UNSIGNED NOT NULL,
    `producto_id` int (10) UNSIGNED NOT NULL,
    `grupo` varchar(60) NOT NULL,
    `valor` varchar(60) NOT NULL,
    `precio_extra` decimal(8, 2) NOT NULL DEFAULT 0.00
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `producto_opciones`
--
INSERT INTO
  `producto_opciones` (
    `id`,
    `producto_id`,
    `grupo`,
    `valor`,
    `precio_extra`
  )
VALUES
  (1, 2, 'Tamaño', 'Pequeño', 0.00),
  (2, 2, 'Tamaño', 'Mediano', 0.50),
  (3, 2, 'Tamaño', 'Grande', 1.00),
  (4, 2, 'Leche', 'Entera', 0.00),
  (5, 2, 'Leche', 'Avena', 0.60),
  (6, 2, 'Leche', 'Almendra', 0.60),
  (7, 3, 'Tamaño', 'Mediano', 0.00),
  (8, 3, 'Tamaño', 'Grande', 0.80),
  (9, 3, 'Leche', 'Entera', 0.00),
  (10, 3, 'Leche', 'Avena', 0.60),
  (11, 3, 'Leche', 'Almendra', 0.60),
  (12, 6, 'Tamaño', 'Regular', 0.00),
  (13, 6, 'Tamaño', 'Grande', 1.20),
  (14, 9, 'Leche', 'Avena', 0.00),
  (15, 9, 'Leche', 'Almendra', 0.60),
  (16, 20, 'Pan', 'Ciabatta', 0.00),
  (17, 20, 'Pan', 'Integral', 0.00),
  (18, 20, 'Pan', 'Sin gluten', 0.80),
  (19, 21, 'Pan', 'Ciabatta', 0.00),
  (20, 21, 'Pan', 'Integral', 0.00),
  (21, 21, 'Pan', 'Sin gluten', 0.80),
  (22, 22, 'Pan', 'Ciabatta', 0.00),
  (23, 22, 'Pan', 'Integral', 0.00),
  (24, 22, 'Pan', 'Sin gluten', 0.80),
  (25, 23, 'Proteína', 'Con pollo', 0.00),
  (26, 23, 'Proteína', 'Sin pollo', -1.00),
  (27, 19, 'Extra', 'Frutos rojos', 1.00),
  (28, 19, 'Extra', 'Nutella', 1.20);

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `usuarios`
--
CREATE TABLE
  `usuarios` (
    `id` int (10) UNSIGNED NOT NULL,
    `nombre` varchar(100) NOT NULL,
    `email` varchar(150) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `telefono` varchar(20) DEFAULT NULL,
    `rol` enum ('cliente', 'admin') NOT NULL DEFAULT 'cliente',
    `activo` tinyint (1) NOT NULL DEFAULT 1,
    `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--
INSERT INTO
  `usuarios` (
    `id`,
    `nombre`,
    `email`,
    `password_hash`,
    `telefono`,
    `rol`,
    `activo`,
    `creado_en`
  )
VALUES
  (
    1,
    'Admin',
    'admin@martascoffee.com',
    '$2b$10$NLZy5Yil80124yR.MQtnQuJj9Py73y0PM/jnH8iL0RarPdCn/CZFy',
    NULL,
    'admin',
    1,
    '2026-05-02 03:11:44'
  ),
  (
    2,
    'María López',
    'maria@martascoffee.com',
    '$2b$10$NLZy5Yil80124yR.MQtnQuJj9Py73y0PM/jnH8iL0RarPdCn/CZFy',
    NULL,
    'admin',
    1,
    '2026-05-02 03:11:44'
  ),
  (
    3,
    'Ana Torres',
    'ana@example.com',
    '$2b$10$NLZy5Yil80124yR.MQtnQuJj9Py73y0PM/jnH8iL0RarPdCn/CZFy',
    '0991234567',
    'cliente',
    1,
    '2026-05-02 03:11:44'
  ),
  (
    4,
    'Luis Mora',
    'luis@example.com',
    '$2b$10$NLZy5Yil80124yR.MQtnQuJj9Py73y0PM/jnH8iL0RarPdCn/CZFy',
    '0987654321',
    'cliente',
    1,
    '2026-05-02 03:11:44'
  ),
  (
    5,
    'Sara Pérez',
    'sara@example.com',
    '$2b$10$NLZy5Yil80124yR.MQtnQuJj9Py73y0PM/jnH8iL0RarPdCn/CZFy',
    NULL,
    'cliente',
    1,
    '2026-05-02 03:11:44'
  );

--
-- Índices para tablas volcadas
--
--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos` ADD PRIMARY KEY (`id`),
ADD KEY `idx_usuario` (`usuario_id`),
ADD KEY `idx_admin` (`atendido_por`);

--
-- Indices de la tabla `pedido_items`
--
ALTER TABLE `pedido_items` ADD PRIMARY KEY (`id`),
ADD KEY `idx_pedido` (`pedido_id`),
ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos` ADD PRIMARY KEY (`id`),
ADD KEY `idx_categoria` (`categoria_id`);

--
-- Indices de la tabla `producto_opciones`
--
ALTER TABLE `producto_opciones` ADD PRIMARY KEY (`id`),
ADD KEY `idx_producto` (`producto_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--
--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias` MODIFY `id` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 9;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos` MODIFY `id` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 4;

--
-- AUTO_INCREMENT de la tabla `pedido_items`
--
ALTER TABLE `pedido_items` MODIFY `id` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos` MODIFY `id` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 30;

--
-- AUTO_INCREMENT de la tabla `producto_opciones`
--
ALTER TABLE `producto_opciones` MODIFY `id` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 29;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios` MODIFY `id` int (10) UNSIGNED NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 6;

--
-- Restricciones para tablas volcadas
--
--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`atendido_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pedido_items`
--
ALTER TABLE `pedido_items` ADD CONSTRAINT `pedido_items_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `pedido_items_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos` ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);

--
-- Filtros para la tabla `producto_opciones`
--
ALTER TABLE `producto_opciones` ADD CONSTRAINT `producto_opciones_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;