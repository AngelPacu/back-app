import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './api/users.js';
import {dataSource} from "./src/infrastructure/persistence/postgresql/data-source.js";


// App es una instancia de express
const app = express()
// Definimos el puerto
const port = 4000
// Middleware CORS
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  response.header('Access-Control-Allow-Headers', 'content-type');
  response.header('Access-Control-Allow-Methods', 'POST, PUT, GET');
  next();
});


app.use(bodyParser.json());
app.use('/api/users', userRoutes);

async function main() {
  try {
    await dataSource.initialize();
    console.log('Conexión a la base de datos inicializada correctamente');
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
  }
}

main();