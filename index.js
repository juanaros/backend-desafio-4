const express = require('express');
const app = express();
const cors = require('cors');
const { agregar, obtener, modificar, eliminar } = require('./consultas');

const PORT = 3000;

app.use(express.json());

app.use(cors());

app.listen(PORT, console.log(`Server up at port ${PORT}`));

app.get('/posts', async (req, res) => {
    try {
        const posts = await obtener();
        res.json(posts)
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor, vuelva a intentarlo más tarde" })
    }
})

app.post('/posts', async (req, res) => {
    try {
        const { titulo, img, descripcion } = req.body
        const result = await agregar(titulo, img, descripcion)
        res.json(result)
    } catch (error) {
        const { code } = error
        if (code == "23502") {
            res.status(400).send("No ha ingresado todos los datos")
        } else {
            res.status(500).send({ error: "Error interno del servidor, vuelva a intentarlo más tarde" })
        }
    }
})

app.put('/posts/like/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await modificar(id);
        res.json(result);
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor, vuelva a intentarlo más tarde" });
    }
})

app.delete('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await eliminar(id)
        if (result.rowCount === 0) {
            res.status(404).send({ message: "Recurso no encontrado" })
        } else {
            res.status(200).send({ message: "Post eliminado" })
        }
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor, vuelva a intentarlo más tarde" })
    }
})