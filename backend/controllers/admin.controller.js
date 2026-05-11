import express from 'express';
const router = express.Router();
import db from '../db.js';
import bcrypt from 'bcrypt';

// Register new user
router.post('/register', async (req, res) => {
    const { nombre, email, password, telefono } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, password_hash, telefono) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, telefono],
        );
        res.status(201).json({ id: result.insertId, message: 'Usuario registrado exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'El email ya está registrado' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Get all categories
router.get('/categorias', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create category
router.post('/categorias', async (req, res) => {
    const { nombre, slug, imagen_url } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO categorias (nombre, slug, imagen_url) VALUES (?, ?, ?)',
            [nombre, slug, imagen_url],
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all products for admin
router.get('/productos', async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
    `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create product
router.post('/productos', async (req, res) => {
    const { categoria_id, nombre, descripcion, precio, imagen_url } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url) VALUES (?, ?, ?, ?, ?)',
            [categoria_id, nombre, descripcion, precio, imagen_url],
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product
router.put('/productos/:id', async (req, res) => {
    const { categoria_id, nombre, descripcion, precio, imagen_url, disponible } = req.body;
    try {
        await db.query(
            'UPDATE productos SET categoria_id = ?, nombre = ?, descripcion = ?, precio = ?, imagen_url = ?, disponible = ? WHERE id = ?',
            [categoria_id, nombre, descripcion, precio, imagen_url, disponible, req.params.id],
        );
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product
router.delete('/productos/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get orders for admin
router.get('/pedidos', async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT p.*, u.nombre as cliente_nombre, a.nombre as admin_nombre
      FROM pedidos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN usuarios a ON p.atendido_por = a.id
      ORDER BY p.creado_en DESC
    `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order
router.put('/pedidos/:id', async (req, res) => {
    const { estado, atendido_por } = req.body;
    try {
        await db.query('UPDATE pedidos SET estado = ?, atendido_por = ? WHERE id = ?', [
            estado,
            atendido_por,
            req.params.id,
        ]);
        res.json({ message: 'Pedido actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        res.json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
