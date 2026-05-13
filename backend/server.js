import express from 'express';
import cors from 'cors';
import adminRoutes from './controllers/admin.controller.js';
import pedidosRoutes from './controllers/pedidos.controller.js';
import productosRoutes from './controllers/productos.controller.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/productos', productosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
