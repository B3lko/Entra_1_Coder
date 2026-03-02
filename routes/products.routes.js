import { Router } from 'express';
import ProductManager from '../ProductManager.js';

const router = Router();
const PM = new ProductManager();

// GET todos
router.get('/', async (req, res) => {
    const productos = await PM.cargar();
    res.json(productos);
});

// GET por id
router.get('/:id', async (req, res) => {
    const producto = await PM.cargarProducto(req.params.id);
    res.json(producto);
});

// POST
router.post('/', async (req, res) => {

    const nuevo = await PM.addProduct(req.body);

    // 🔥 Emitimos actualización
    const productosActualizados = await PM.cargar();
    const io = req.app.get("io");
    io.emit("updateProducts", productosActualizados);

    res.status(201).json(nuevo);
});

// PUT
router.put('/:pid', async (req, res) => {
    const actualizado = await PM.updateProduct(
        req.params.pid,
        req.body
    );

    if (!actualizado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(actualizado);
});

// DELETE
router.delete('/:pid', async (req, res) => {

    const eliminado = await PM.deleteProduct(req.params.pid);

    if (!eliminado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // 🔥 Emitimos actualización
    const productosActualizados = await PM.cargar();
    const io = req.app.get("io");
    io.emit("updateProducts", productosActualizados);

    res.json({
        message: 'Producto eliminado',
        product: eliminado
    });
});

export default router;