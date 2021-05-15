const express = require("express");
const app = express();
const uniqid = require("uniqid");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

let menuList = require("./menu");
let clientList = require("./client");
let order = require("./order");

//menuList
app.get("/api/menu", (req, res) => {
  try {
    res.json(menuList);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

app.get("/api/menu/:id", (req, res) => {
  try {
    const itemFound = menuList.find((item) => item.id == req.params.id);
    if (itemFound) res.json(itemFound);
    else throw new Error("No se encuentra el item seleccionado");
  } catch (e) {
    res.status(404).send(e.message);
  }
});

app.post("/api/menu", (req, res) => {
  try {
    if (!req.body.nombre || !req.body.descripcion || !req.body.precio)
      throw new Error("Todos los datos son requeridos");
    const nombre = req.body.nombre.toUpperCase().trim();
    const descripcion = req.body.descripcion.toUpperCase().trim();
    const precio = req.body.precio;

    const verifyName = menuList.find((item) => item.nombre == nombre);

    if (verifyName) throw new Error("Ese ítem ya existe");

    const newItem = {
      nombre,
      descripcion,
      precio,
      id: uniqid(),
    };
    menuList = [...menuList, newItem];
    res.json(newItem);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.put("/api/menu/:id", (req, res) => {
  try {
    const datos = menuList.find((item) => item.id == req.params.id);
    const nombre = datos.nombre;
    const descripcion = req.body.descripcion.toUpperCase().trim();
    const precio = req.body.precio;

    const toUpdate = { nombre, descripcion, precio, id: req.params.id };
    menuList = menuList.map((item) =>
      item.id == req.params.id ? toUpdate : item
    );
    res.json(toUpdate);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.delete("/api/menu/:id", (req, res) => {
  try {
    menuList = menuList.filter((item) => item.id != req.params.id);
    res.json('Eliminado con éxito');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//clientList

app.get("/api/client", (req, res) => {
  try {
    res.json(clientList);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

app.get("/api/client/:id", (req, res) => {
  try {
    const clientFind = clientList.find((client) => client.id == req.params.id);
    if (clientFind) res.json(clientFind);
    else throw new Error("No se encontró el cliente");
  } catch (e) {
    res.status(404).send(e.message);
  }
});

app.post("/api/client", (req, res) => {
  try {
    const newClient = {
      ...req.body,
      id: uniqid(),
    };
    clientList = [...clientList, newClient];
    res.json(newClient);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

app.put("/api/client/:id", (req, res) => {
  try {
    const toUpdate = { ...req.body, id: req.params.id };
    clientList = clientList.map((client) =>
      client.id != req.params.id ? toUpdate : client
    );
    res.json(toUpdate);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

app.delete("/api/client/:id", (req, res) => {
  try {
    clientList = clientList.filter((client) => client.id != req.params.id);
    res.json({});
  } catch (e) {
    res.status(404).send(e.message);
  }
});

//order

app.listen(PORT, () => console.log("App corriendo en el puerto " + PORT));
