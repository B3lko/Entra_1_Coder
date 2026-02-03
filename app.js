import express from 'express';
import ProductManager from './ProductManager.js';

const PM = new ProductManager();

const PORT = 8080;

const app = express();

let users = [];


//Permitimos que express entienda json
app.use(express.json());



app.get('/', (req, res) => {
    res.send("Bienvenidosas");
})



/*app.get('/api/products/:id', (req, res) => {
    res.send("Bienvenidos producto" + req.params.id);
})*/



app.get('/api/products/:id', async (req, res) => {
    let producto = await PM.cargarProducto(req.params.id);
    res.send("Producto solicita:\n" + JSON.stringify(producto));
})



app.get('/api/products/', async (req, res) => {
    let datos = await PM.cargar();
    if(datos == 0){
        res.send("No hay ningun producto registrado");
    }
    res.send("Lista completa de productos:\n" + JSON.stringify(datos));
})



//Guardar producto
app.post('/api/products/', async (req, res) => {

    //Cargamos el array de productos
    users = await PM.cargar();

    //Desestructuramos el req.body
    const {name, email, age} = req.body;

    //Añadimos el nuevo objeto
    users.push({
        name,
        email,
        age
    });

    //Guardamos el nuevo objeto
    await PM.guardar(users)
    res.send("Listo");
})





//Dejamos el servidor escuchando
app.listen(PORT, () => {
    console.log("Server lisening at port: " + PORT);
})