import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './api/users.js';
import { authenticateToken,corsMiddleware } from './api/middleware.js';
import {dataSource} from "./src/infrastructure/persistence/postgresql/data-source.js";
import cookieParser from "cookie-parser";

// App es una instancia de express
const app = express()
// Usar cookie-parser
app.use(cookieParser())
app.use(bodyParser.json())

// Definimos el puerto
const port = 4000
// Middleware
app.use(corsMiddleware)
app.use(authenticateToken)

// Rutas privadas


// Rutas publicas
app.use('/api/public', userRoutes)

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

