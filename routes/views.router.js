import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// HOME
router.get("/home", async (req, res) => {
    const productos = await productManager.cargar();

    res.render("home", {
        productos
    });
});

// REAL TIME PRODUCTS
router.get("/realtimeproducts", async (req, res) => {
    const productos = await productManager.cargar();

    res.render("realTimeProducts", {
        productos
    });
});

export default router;