import express from 'express';
const router = express.Router();

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';


const PORT = 8080;
const app = express();


//Permitimos que express entienda json
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Bienvenidos");
})


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


//Dejamos el servidor escuchando
app.listen(PORT, () => {
    console.log("Server lisening at port: " + PORT);
})