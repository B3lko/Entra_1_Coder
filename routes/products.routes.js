import { Router } from 'express';
import Product from "../models/Product.js";

const router = Router();


//GET TODOS (YA LO TENÉS BIEN)
router.get("/", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;

        limit = parseInt(limit);
        page = parseInt(page);

        let filter = {};

        if (query) {
            if (query === "true" || query === "false") {
                filter.status = query === "true";
            } else {
                filter.category = query;
            }
        }

        let sortOption = {};
        if (sort === "asc") sortOption.price = 1;
        if (sort === "desc") sortOption.price = -1;

        const result = await Product.paginate(filter, {
            limit,
            page,
            sort: sortOption,
            lean: true
        });

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
        });

    } catch (error) {
        res.status(500).json({ status: "error", error });
    }
});


//GET POR ID
router.get('/:id', async (req, res) => {
    const producto = await Product.findById(req.params.id);
    res.json(producto);
});


//POST (CREAR EN MONGO)
router.post('/', async (req, res) => {

    const nuevo = await Product.create(req.body);

    //Emitimos actualización (ahora desde Mongo)
    const productosActualizados = await Product.find().lean();
    const io = req.app.get("io");
    io.emit("updateProducts", productosActualizados);

    res.status(201).json(nuevo);
});


//PUT (ACTUALIZAR)
router.put('/:pid', async (req, res) => {

    const actualizado = await Product.findByIdAndUpdate(
        req.params.pid,
        req.body,
        { new: true }
    );

    if (!actualizado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(actualizado);
});


//DELETE
router.delete('/:pid', async (req, res) => {

    const eliminado = await Product.findByIdAndDelete(req.params.pid);

    if (!eliminado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    //Emitimos actualización
    const productosActualizados = await Product.find().lean();
    const io = req.app.get("io");
    io.emit("updateProducts", productosActualizados);

    res.json({
        message: 'Producto eliminado',
        product: eliminado
    });
});

export default router;
