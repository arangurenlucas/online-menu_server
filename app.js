const express = require("express");
const app = express();
const uniqid = require("uniqid");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

let menuList = require("./menu");
let categoryList = require("./category.json");

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
    if (
      !req.body.nombre ||
      !req.body.descripcion ||
      !req.body.precio ||
      !req.body.categoria_id
    )
      throw new Error("Todos los datos son requeridos");
    const nombre = req.body.nombre.toUpperCase().trim();
    const descripcion = req.body.descripcion.toUpperCase().trim();
    const precio = req.body.precio;
    const unidades = req.body.unidades;
    const categoria_id = req.body.categoria_id;

    const verifyName = menuList.find((item) => item.nombre == nombre);

    if (verifyName) throw new Error("Ese ítem ya existe");

    const newItem = {
      nombre,
      descripcion,
      precio,
      unidades,
      categoria_id,
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
    const unidades = req.body.unidades;
    const categoria_id = req.body.categoria_id;

    const toUpdate = {
      nombre,
      descripcion,
      precio,
      unidades,
      categoria_id,
      id: req.params.id,
    };
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
    res.json("Eliminado con éxito");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//categorias

app.get("/api/categorias", (req, res) => {
  try {
    res.json(categoryList);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.get("/api/categorias/:id", (req, res) => {
  try {
    const itemFound = categoryList.find(
      (unaCategoria) => unaCategoria.id == req.params.id
    );
    if (itemFound) res.json(itemFound);
    throw new Error("Esa categoria no existe");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/api/categorias", (req, res) => {
  try {
    const nombre = req.body.nombre.toUpperCase().trim();
    if (!nombre) throw new Error("Nombre de categoría es necesario");
    const verifyName = categoryList.find(
      (unaCategoria) => unaCategoria.nombre == nombre
    );
    if (verifyName) throw new Error("Esa categoria ya existe");
    const newCategory = {
      nombre,
      id: uniqid(),
    };
    categoryList = [...categoryList, newCategory];
    res.json(newCategory);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.delete("/api/categorias/:id", (req, res) => {
  try {
    const verifyMenu = menuList.find(
      (item) => item.categoria_id == req.params.id
    );
    if (verifyMenu)
      throw new Error(
        "Esa categoria tiene items asociados, no se puede eliminar"
      );
    categoryList = categoryList.filter(
      (unaCategoria) => unaCategoria.id != req.params.id
    );

    res.send("Eliminado con éxito");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.listen(PORT, () => console.log("App corriendo en el puerto " + PORT));
