const socket = io();
const lista = document.getElementById("listaProductos");

socket.on("updateProducts", (productos) => {
    lista.innerHTML = "";

    productos.forEach(prod => {
        const li = document.createElement("li");
        li.textContent = `${prod.title} - $${prod.price} (ID: ${prod.id})`;
        lista.appendChild(li);
    });
});