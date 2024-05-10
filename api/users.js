import express, { response } from 'express';
import { dataSource } from "../src/infrastructure/persistence/postgresql/data-source.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';


const saltRounds = 5;
const router = express.Router();

async function registerUser(req, res) {
  const { username, password, nombre, apellidos, email, telefono } = req.body;
  try {
    const userRepository = dataSource.getRepository('users');
    const existingUser = await userRepository.findOneBy({ username });
    // Hashing de la pass
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Comprobación del usuario, si ya existe -> error.
    if (existingUser) {
      return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
    }

    const newUser = userRepository.create({
      id: uuidv4(),
      username,
      password: hashedPassword,
      nombre,
      apellidos,
      email,
      telefono
    });
    
    // Guardaramos usuario y notificamos en caso correcto.
    await userRepository.save(newUser);
    res.status(201).json({ message: 'Usuario creado con éxito', user: newUser.username });
  } catch (error) {
    console.error('Error al registrar el usuario: ', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    // Buscar el usuario en la base de datos
    const userRepository = dataSource.getRepository('users');
    const user = await userRepository.findOneBy({ username });
    // Comparar la contraseña hasheada
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Crear el token FALTA Cambiar la clavesecreta por una de entorno.
      const token = jwt.sign({ sub: user.username }, 'veryVerySecretKey', { expiresIn: '1h' });
      // Enviar el token en una cookie
      res.cookie('auth', token, {httpOnly: true});
      res.status(200).json({ user: user.username, token });
    } else {
      res.status(401).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function logoutUser(req, res) {
  try {
    //Borrar la cookie
    res.cookie('auth', '', { expires: new Date(0), httpOnly: true, path: '/'});
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getFactura(req, res) {
  try {
    const userRepository = dataSource.getRepository('users');
    const user = await userRepository.findOneBy({ username: req.user.sub });
    const facturaRepository = dataSource.getRepository('facturas');
    const facturas = await facturaRepository.find({
      where: { users: { id: user.id } },
      relations: ["users"] // Relación con la tabla de usuarios
  });
    res.status(200).json(facturas);
  } catch (error) {
    console.error('Error al obtener las facturas:', error);
    res.status(500).json({ error: error.message });
  }

}

async function GetOrCreateCarrito(userId) {
  // carro = factura
  try {

    const carroRepository = dataSource.getRepository('facturas');
    // Buscamos el carro del usuario
    let carro = await carroRepository.findOne({
      where: { users: {id: userId},
      estado: 'carrito' } ,
      relations: ['users'],
    });
    // Si no existe el carro, lo creamos
    if (!carro) {
      carro = carroRepository.create({ users: {id: userId} ,
        estado: 'carrito' });
      await carroRepository.save(carro);
      console.log('Creado');
    }
    return carro;
  } catch (error) {
    console.error('Error al obtener el carro:', error);
    res.status(500).json({ error: error.message });
  }
}


async function addGametoCarrito (req, res) {
  try {
    const userRepository = dataSource.getRepository('users');
    const detalleRepository = dataSource.getRepository('detalle_facturas');
    const gameRepository = dataSource.getRepository('games');
    const user = await userRepository.findOneBy({ username: req.user.sub });
    const factura = await GetOrCreateCarrito(user.id);
    const game = await gameRepository.findOneBy({ id: req.body.gameId });
    if (!game) {
      return res.status(404).json({ message: 'El juego no existe' });
    }
    // Buscar si ya existe el detalle de la factura para este juego
    let detalle = await detalleRepository.findOne({
      where: {
        facturas: { id: factura.id },
        games: { id: game.id }
      }
    });
    if (detalle) {
      // Si el detalle ya existe, incrementar la cantidad
      detalle.cantidad += 1;
    } else {
      // Si no existe, crear un nuevo detalle de factura
      detalle = detalleRepository.create({
        cantidad: 1,
        descuento: 0,
        facturas: factura,
        games: game
      });
    }
    // Guardar el detalle de la factura
    await detalleRepository.save(detalle);
    res.status(200).json({ message: 'Juego añadido al carro' });
  } catch (error) {
    console.error('Error al añadir el juego al carro:', error);
    res.status(500).json({ error: error.message });
  }
}

async function GetCarritoDetails (req,res){   
  try {
    const userRepository = dataSource.getRepository('users');
    const detalleRepository = dataSource.getRepository('detalle_facturas');
    const user = await userRepository.findOneBy({ username: req.user.sub });
    const factura = await GetOrCreateCarrito(user.id);
    const detalles = await detalleRepository.find({
      where: { facturas: {id: factura.id} },
      relations: ['games']
    });
    
    res.status(200).json(detalles);
  } catch (error) {
    console.error('Error al obtener los detalles del carro:', error);
    res.status(500).json({ error: error.message });
  }
}


// Rutas
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/facturas', getFactura);
router.post('/carrito/add', addGametoCarrito);
router.post('/carrito', GetCarritoDetails);



export default router;

