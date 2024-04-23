import express from 'express';
import { dataSource } from "../src/infrastructure/persistence/postgresql/data-source.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


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
    const userRepository = dataSource.getRepository('User');
    const user = await userRepository.findOneBy({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Comparar la contraseña hasheada
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ message: 'Login exitoso!' });
    } else {
      res.status(401).json({ message: 'Contraseña incorrecta.' });
    }
  } catch (error) {
    console.error('Error al intentar el login: ', error);
    res.status(500).json({ message: 'Error al intentar el login', error: error.message });
  }
}


// Rutas
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;

