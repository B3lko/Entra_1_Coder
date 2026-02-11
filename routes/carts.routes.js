import { Router } from "express";
import CartManager from "../CartManager.js";

const router = Router();
const CM = new CartManager();

// POST /api/carts
router.post("/", async (req, res) => {
    const nuevo = await CM.createCart();
    res.status(201).json(nuevo);
});

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
    const cart = await CM.getCartById(req.params.cid);

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
    const actualizado = await CM.addProductToCart(
        req.params.cid,
        req.params.pid
    );

    if (!actualizado) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(actualizado);
});

export default router;
