import { Router } from "express";
import Cart from "../models/Cart.js";

const router = Router();


//CREAR CARRITO
router.post("/", async (req, res) => {
    const nuevo = await Cart.create({ products: [] });
    res.status(201).json(nuevo);
});


//OBTENER CARRITO CON POPULATE
router.get("/:cid", async (req, res) => {

    const cart = await Cart.findById(req.params.cid)
        .populate("products.product")
        .lean();

    res.json(cart);
});


//AGREGAR PRODUCTO AL CARRITO
router.post("/:cid/products/:pid", async (req, res) => {

    const cart = await Cart.findById(req.params.cid);

    const index = cart.products.findIndex(
        p => p.product.toString() === req.params.pid
    );

    if (index !== -1) {
        cart.products[index].quantity += 1;
    } else {
        cart.products.push({
            product: req.params.pid,
            quantity: 1
        });
    }

    await cart.save();

    res.json(cart);
});


//ELIMINAR PRODUCTO DEL CARRITO
router.delete("/:cid/products/:pid", async (req, res) => {

    const cart = await Cart.findById(req.params.cid);

    cart.products = cart.products.filter(
        p => p.product.toString() !== req.params.pid
    );

    await cart.save();

    res.json(cart);
});


//ACTUALIZAR TODO EL CARRITO
router.put("/:cid", async (req, res) => {

    const { products } = req.body;

    const actualizado = await Cart.findByIdAndUpdate(
        req.params.cid,
        { products },
        { new: true }
    );

    res.json(actualizado);
});


//ACTUALIZAR SOLO CANTIDAD
router.put("/:cid/products/:pid", async (req, res) => {

    const { quantity } = req.body;

    const cart = await Cart.findById(req.params.cid);

    const producto = cart.products.find(
        p => p.product.toString() === req.params.pid
    );

    if (producto) {
        producto.quantity = quantity;
    }

    await cart.save();

    res.json(cart);
});


//VACIAR CARRITO
router.delete("/:cid", async (req, res) => {

    const cart = await Cart.findById(req.params.cid);

    cart.products = [];

    await cart.save();

    res.json(cart);
});

export default router;