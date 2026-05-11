#Marta's Coffee — Proyecto CW

## Requisitos previos

- [Node.js](https://nodejs.org/) instalado
- [XAMPP](https://www.apachefriends.org/) instalado

---

## 1. Configurar la base de datos

1. Abre **XAMPP** y enciende **MySQL** y **Apache**
2. Entra a [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Clic en **Nueva** → nombre: `proyecto_cw` → **Crear**
4. Selecciona la BD `proyecto_cw` → pestaña **Importar**
5. Selecciona el archivo `backend/db.sql` → **Continuar**

---

## 2. Instalar dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

---

## 3. Correr el proyecto

Necesitas **dos terminales** abiertas al mismo tiempo:

**Terminal 1 — Backend:**

```bash
npm run server
```

Debe aparecer: `Server running on port 3000`

**Terminal 2 — Frontend:**

```bash
npm run dev
```

Abre el navegador en: [http://localhost:5173](http://localhost:5173)

---

## 4. Usuarios de prueba

| Rol     | Email                  | Contraseña |
| ------- | ---------------------- | ---------- |
| Admin   | admin@martascoffee.com | password   |
| Cliente | ana@example.com        | password   |

> El admin entra al panel en `/admin`. Los clientes van al home.

---

## 5. Estructura del proyecto

```
proyecto-cw/
├── backend/
│   ├── server.js          → servidor Express
│   ├── db.js              → conexión a MySQL
│   ├── db.sql             → script de la base de datos
│   └── controllers/
│       ├── admin.controller.js    → login, register, CRUD
│       ├── productos.controller.js → categorías y productos
│       └── pedidos.controller.js  → pedidos
├── src/
│   ├── components/
│   │   ├── shared/        → navbar, footer
│   │   ├── home/          → categoriaCard
│   │   └── catalog/       → productCard, searchBar, etc.
│   ├── pages/
│   │   ├── home.js        → página principal
│   │   ├── menu.js        → catálogo de productos
│   │   ├── login.js       → inicio de sesión
│   │   ├── register.js    → registro de usuario
│   │   └── admin.js       → panel de administración
│   ├── router/
│   │   └── router.js      → rutas y protección por rol
│   ├── auth.js            → manejo de sesión
│   └── main.js            → entrada principal
└── index.html
```

---

## 6. Endpoints principales de la API

| Método | Ruta                             | Descripción                  |
| ------ | -------------------------------- | ---------------------------- |
| POST   | `/api/admin/login`               | Iniciar sesión               |
| POST   | `/api/admin/register`            | Registrar usuario            |
| GET    | `/api/productos/categorias`      | Listar categorías            |
| GET    | `/api/productos/categoria/:slug` | Productos por categoría      |
| GET    | `/api/admin/pedidos`             | Ver todos los pedidos        |
| PUT    | `/api/admin/pedidos/:id`         | Actualizar estado del pedido |

---

## Notas importantes

- Si el frontend no carga datos, verifica que el **servidor esté corriendo** en el puerto 3000
- Si hay error de base de datos, verifica que **MySQL esté activo** en XAMPP
- Los roles son: `admin` (accede a `/admin`) y `cliente` (accede al home)
