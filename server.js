import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './api/users.js';
import prodRoutes from './api/products.js'
import { authenticateToken,corsMiddleware } from './api/middleware.js';
import {dataSource} from "./src/infrastructure/persistence/postgresql/data-source.js";
import cookieParser from "cookie-parser";

// App es una instancia de express
const app = express()
// Usar cookie-parser
app.use(cookieParser())
app.use(bodyParser.json())

// Definimos el puerto
const port = process.env.PORT
// Middleware
app.use(corsMiddleware)
app.use(authenticateToken)

// Rutas publicas
app.use('/api/public', userRoutes)
app.use('/api/public', prodRoutes)

// Ruta de verificación de autenticación
app.get('/api/verify', authenticateToken, (req, res) => {
  if (req.user) {
    res.status(200).json({ username: req.user.sub });
  } else {
    res.status(401).send('No autenticado');
  }
});

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

