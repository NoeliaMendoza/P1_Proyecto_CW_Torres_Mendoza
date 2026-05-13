import express from 'express';
const router = express.Router();
import db from '../db.js';

// Create a new order
router.post('/', async (req, res) => {
    const { usuario_id, nombre_cliente, email_cliente, telefono_cliente, notas, items } = req.body;
    try {
        // Calculate total
        let subtotal = 0;
        for (const item of items) {
            subtotal += (item.precio_unit + (item.precio_extra || 0)) * item.cantidad;
        }
        const total = subtotal * 1.15; // 15% impuestos

        // Insert order
        const [orderResult] = await db.query(
            `
      INSERT INTO pedidos (usuario_id, nombre_cliente, email_cliente, telefono_cliente, notas, total)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
            [usuario_id || null, nombre_cliente, email_cliente, telefono_cliente, notas, total],
        );

        const pedidoId = orderResult.insertId;

        // Insert items
        for (const item of items) {
            await db.query(
                `
        INSERT INTO pedido_items (pedido_id, producto_id, nombre, opcion_grupo, opcion_valor, precio_unit, cantidad)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
                [
                    pedidoId,
                    item.producto_id,
                    item.nombre,
                    item.opcion_grupo,
                    item.opcion_valor,
                    item.precio_unit,
                    item.cantidad,
                ],
            );
        }

        res.status(201).json({ id: pedidoId, message: 'Pedido creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all orders (for admin)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT p.*, u.nombre as admin_nombre
      FROM pedidos p
      LEFT JOIN usuarios u ON p.atendido_por = u.id
      ORDER BY p.creado_en DESC
    `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get orders by user id
router.get('/usuario/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY creado_en DESC',
            [req.params.id],
        );

        const pedidosConItems = [];
        for (const pedido of rows) {
            const [itemRows] = await db.query('SELECT * FROM pedido_items WHERE pedido_id = ?', [
                pedido.id,
            ]);
            pedidosConItems.push({ ...pedido, items: itemRows });
        }

        res.json(pedidosConItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order by id
router.get('/:id', async (req, res) => {
    try {
        const [orderRows] = await db.query('SELECT * FROM pedidos WHERE id = ?', [req.params.id]);
        if (orderRows.length === 0)
            return res.status(404).json({ message: 'Pedido no encontrado' });

        const [itemRows] = await db.query('SELECT * FROM pedido_items WHERE pedido_id = ?', [
            req.params.id,
        ]);

        res.json({ ...orderRows[0], items: itemRows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status
router.put('/:id', async (req, res) => {
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

export default router;
