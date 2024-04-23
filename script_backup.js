import express from 'express';
import {readFile, writeFile} from "node:fs/promises";
// import { DataSource } from 'typeorm';
import {dataSource} from "./src/infrastructure/persistence/postgresql/data-source.js";
import {UserSchema} from "./src/infrastructure/persistence/postgresql/schemas/user-schema.js";

// App es una instancia de express
const app = express()
// Definimos el puerto
const port = 4000

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.header('Access-Control-Allow-Headers', 'content-type')
    response.header('Access-Control-Allow-Methods', 'POST,PUT,GET,DELETE')
    next()
})



app.get('/users', async (request, response) => {
    const usersRepository = dataSource.getRepository(UserSchema)
    const users = await usersRepository.find()
    response.json(users)
});

app.get('/users/:userId', async (req,res) => {
    const {userId} = req.params
    const usersRepository = dataSource.getRepository(UserSchema);
    const user = await usersRepository.findOneBy({id: userId});
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    user ? res.json(user) : res.sendStatus(404);
})

app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    const usersRepository = dataSource.getRepository(UserSchema);
    const user = await usersRepository.save(newUser);
    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear usuario' });
  }
});


app.delete('/users/:userId', async (req,res) => {
    const {userId} = req.params
    const usersRepository = dataSource.getRepository(UserSchema);
    await usersRepository.delete(userId);
    res.sendStatus(204);

})

// Optimitzar DB connections
await dataSource.initialize();


app.listen(port, () => {
    console.log(`Localhost escuchando por el puerto ${port}`)
})