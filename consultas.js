const { Pool } = require('pg');

const pool = new Pool ({
    host: "localhost",
    user: "postgres",
    password: "2833",
    database: "likeme",
    allowExitOnIdle: true
})

const agregar = async(titulo, img, descripcion) => {
    let likes = 0
    const query = await pool.query("INSERT INTO posts VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id",
    [titulo, img, descripcion, likes]);
    const cardId = query.rows[0].id
    const result = {id: cardId, titulo, img, descripcion, likes}
    console.log(query.rows[0].id)
    console.log(query)
    return result
}

const obtener = async() => {
    const query = "SELECT * FROM posts";
    const result = await pool.query(query);
    return result.rows;
}

const modificar = async(id) => {
    const firstQuery = "SELECT likes FROM posts WHERE id = $1";
    const firstValues = [id];
    const firstResult = await pool.query(firstQuery, firstValues);
    const data = firstResult.rows[0];
    console.log(data)
    let like = data.likes + 1;
    const secondQuery = "UPDATE posts SET likes = $1 WHERE id = $2";
    const secondValue = [like, id];
    const secondResult = await pool.query(secondQuery, secondValue);
    return secondResult.rows[0];
}

const eliminar = async(id) => {
    const query = "DELETE FROM posts WHERE id = $1";
    const values = [id];
    const result = await pool.query(query, values);
    return result;
}

module.exports = {
    agregar,
    obtener,
    modificar,
    eliminar
}