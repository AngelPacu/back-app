// Importa las dependencias necesarias y configura tu enrutador
import express from 'express';
import { dataSource } from "../src/infrastructure/persistence/postgresql/data-source.js";
import { readFile } from "node:fs/promises";

const router = express.Router();


async function createProducts(req, res) {
  try {
    const juegosData = await readFile('products.json','utf-8');
    const juegosJSON = JSON.parse(juegosData)
    const juegosRepository = dataSource.getRepository("games");
    
    // Guardar cada juego en la base de datos
    for (const juegoData of juegosJSON.products) {
        const juego = juegosRepository.create(juegoData);
        await juegosRepository.save(juego);
    }
    res.status(200).json({ success: true, message: 'Datos de juegos cargados correctamente' });
  } catch (error) {
    console.error('Error al cargar los datos de juegos:', error);
    res.status(500).json({ success: false, message: 'Error al cargar los datos de juegos' });
  }
};

// Controlador para obtener la lista de productos
async function getProducts(req, res) {
  try {
    const productRepository = dataSource.getRepository('games');
    const products = await productRepository.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const productRepository = dataSource.getRepository('games');
    const product = await productRepository.findOneById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener los detalles del producto:', error);
    res.status(500).json({ error: error.message });
  }
}


// Define las rutas para la API de productos
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/games', createProducts);

export default router;
