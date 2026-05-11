import express from 'express';
const router = express.Router();
import db from '../db.js';

// Get all categories
router.get('/categorias', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias WHERE activo = 1');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get products by category
router.get('/categoria/:slug', async (req, res) => {
    try {
        const [rows] = await db.query(
            `
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE p.disponible = 1 AND c.activo = 1 AND c.slug = ?
    `,
            [req.params.slug],
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product options
router.get('/:id/opciones', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM producto_opciones WHERE producto_id = ?', [
            req.params.id,
        ]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product by id (esta ruta debe ir al final)
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ? AND p.disponible = 1
    `,
            [req.params.id],
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
