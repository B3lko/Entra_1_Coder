import fs from "fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const archivo = path.join("data", "carts.json");

export default class CartManager {

    async cargar() {
        try {
            const data = await fs.readFile(archivo, "utf-8");
            if (data.trim().length === 0) return [];
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async guardar(datos) {
        await fs.writeFile(
            archivo,
            JSON.stringify(datos, null, 2)
        );
    }

    // POST /
    async createCart() {
        const carts = await this.cargar();

        const nuevoCart = {
            id: crypto.randomUUID(),
            products: []
        };

        carts.push(nuevoCart);
        await this.guardar(carts);

        return nuevoCart;
    }

    // GET /:cid
    async getCartById(cid) {
        const carts = await this.cargar();
        return carts.find(c => c.id === cid);
    }

    // POST /:cid/product/:pid
    async addProductToCart(cid, pid) {
        const carts = await this.cargar();

        const cartIndex = carts.findIndex(c => c.id === cid);
        if (cartIndex === -1) return null;

        const cart = carts[cartIndex];

        const productIndex = cart.products.findIndex(
            p => p.product === pid
        );

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }

        carts[cartIndex] = cart;
        await this.guardar(carts);

        return cart;
    }
}
