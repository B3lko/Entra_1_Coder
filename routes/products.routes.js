import { Router } from 'express';
import ProductManager from '../ProductManager.js';

const router = Router();
const PM = new ProductManager();


//GET
router.get('/', async (req, res) => {
    res.send("Listado de producto solicitados:\n" + JSON.stringify(await PM.cargar()));
});


//GET
router.get('/:id', async (req, res) => {
    let producto = await PM.cargarProducto(req.params.id);
    res.send("Producto solicita:\n" + JSON.stringify(producto));
});


//POST
router.post('/', async (req, res) => {
  const nuevo = await PM.addProduct(req.body);
  res.status(201).json(nuevo);
});


//PUT
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


///DELETE
router.delete('/:pid', async (req, res) => {
    const eliminado = await PM.deleteProduct(req.params.pid);

    if (!eliminado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
        message: 'Producto eliminado',
        product: eliminado
    });
});

export default router;
