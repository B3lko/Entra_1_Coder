import fs from "fs/promises";
import { log } from "node:console";
import path from "node:path"


let archivo = path.join("data", "users.json");

export default class ProductManager{
    
    super(){
        this.products = []
    }

    addProduct(){
        
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
        let data = await fs.readFile(archivo, "utf-8");
        this.products = JSON.parse(data);
        let product = this.products.find(fede => fede.id === Number(id));
        console.log(product)
        return product;
    }




    async guardar(datos){
        let data = JSON.stringify(datos, null, 2)
        await fs.writeFile(archivo, data);
        return;
    }



    async guardarjson(datos){
        await fs.writeFile(archivo,
            //JSON.stringify(users, null, 2)
            JSON.stringify(datos, null, 2)
        );

        /*id: Number/String (No se manda desde el body, se autogenera para asegurar que nunca se repitan los ids).
        title: String
        description: String
        code: String
        price: Number
        status: Boolean
        stock: Number
        category: String
        thumbnails: Array de Strings (rutas donde están almacenadas las imágenes del producto).*/
    }

}


const datos = {
    nombre: "Federico",
    edad: 23,
    isTipazo: true
}

/*
let pm = new ProductManager();
let datos2 = await pm.cargar();
console.log(datos2);*/
//const users = JSON.parse(datos2);
//console.log(users);
//pm.guardarjson(datos);