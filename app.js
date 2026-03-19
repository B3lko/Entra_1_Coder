import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from "socket.io";
import http from "http";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from "mongoose";

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Mongo conectado"))
    .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Guardamos io global
app.set("io", io);

// WebSocket
io.on("connection", async (socket) => {
    console.log("Cliente conectado");

    // Enviar lista inicial
    const productos = await productManager.cargar();
    socket.emit("updateProducts", productos);

    // Agregar producto
    socket.on("addProduct", async (data) => {
        await productManager.addProduct(data);
        const productosActualizados = await productManager.cargar();
        io.emit("updateProducts", productosActualizados);
    });

    // Eliminar producto
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        const productosActualizados = await productManager.cargar();
        io.emit("updateProducts", productosActualizados);
    });
});

// Routers
app.use("/", viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

server.listen(PORT, () => {
    console.log("Server listening at port: " + PORT);
});
