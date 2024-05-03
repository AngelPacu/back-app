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

// Rutas
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;

