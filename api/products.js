// Importa las dependencias necesarias y configura tu enrutador
import express from 'express';
import { dataSource } from "../src/infrastructure/persistence/postgresql/data-source.js";

const router = express.Router();

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
    const productId = req.params.id;
    const productRepository = dataSource.getRepository('games');
    const product = await productRepository.findOneById(productId);
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

export default router;
