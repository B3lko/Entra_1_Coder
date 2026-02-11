import fs from "fs/promises";
import { log } from "node:console";
import path from "node:path"
import crypto from "node:crypto";


let archivo = path.join("data", "products.json");

export default class ProductManager{
    
    constructor(){
        this.products = []
    }


    async cargar(){
        let data = await fs.readFile(archivo, "utf-8");
        if (data.trim().length === 0) {
            console.log("El archivo está vacío (sin texto)");
            return [];
        }
        else{
            this.products = JSON.parse(data);
            return this.products;
        }
    }

    async cargarProducto(id){
        const productos = await this.cargar();
        return productos.find(p => p.id === id);
    }


    async guardar(datos){
        let data = JSON.stringify(datos, null, 2)
        await fs.writeFile(archivo, data);
        return;
    }


    async guardarjson(datos){
        await fs.writeFile(archivo,
            JSON.stringify(datos, null, 2)
        );
    }


    async addProduct(producto) {
        const productos = await this.cargar();
        const nuevoProducto = {
            id: crypto.randomUUID(),
            title: producto.title,
            description: producto.description,
            code: producto.code,
            price: producto.price,
            status: producto.status ?? true,
            stock: producto.stock,
            category: producto.category,
            thumbnails: producto.thumbnails ?? []
        };
        productos.push(nuevoProducto);
        await this.guardar(productos);
        return nuevoProducto;
    }

    async updateProduct(id, data) {
        const productos = await this.cargar();

        const index = productos.findIndex(p => p.id === id);
        if (index === -1) return null;

        // NO permitimos cambiar el id
        const productoActualizado = {
            ...productos[index],
            ...data,
            id: productos[index].id
        };

        productos[index] = productoActualizado;
        await this.guardar(productos);

        return productoActualizado;
    }

    async deleteProduct(id) {
        const productos = await this.cargar();

        const index = productos.findIndex(p => p.id === id);
        if (index === -1) return null;

        const eliminado = productos[index];

        productos.splice(index, 1);
        await this.guardar(productos);

        return eliminado;
    }

}
