import { Router } from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

const router = Router();

router.get("/products", async (req, res) => {

    let { page = 1, limit = 5 } = req.query;

    const result = await Product.paginate({}, {
        page,
        limit,
        lean: true
    });

    res.render("products", {
        products: result.docs,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage
    });
});


router.get("/carts/:cid", async (req, res) => {

    const cart = await Cart.findById(req.params.cid)
        .populate("products.product")
        .lean();

    res.render("cart", { cart });
});

export default router;