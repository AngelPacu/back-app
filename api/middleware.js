import jwt from 'jsonwebtoken';
// Middleware para autenticar el token


async function authenticateToken(req, res, next) {
    // Obtener el token de autorización del encabezado de la solicitud
    const token = req.cookies.auth;
    // Verificar si el token existe
    if (!token) {
        next()
        console.log('No hay token')
        return res.status(401);
    }
    // Verificar y decodificar el token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) { return res.status(403);}
    // Almacenar el usuario en el objeto de solicitud para su uso posterior
    req.user = user;
    // Continuar al siguiente middleware
    next();
    });
}


// Middleware CORS para permitir entre protocolos. 
async function corsMiddleware(req, res, next) {
    // Set headers to allow cross-origin requests
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    // Continue to the next middleware
    next();
}

// Exportar los middlewares
export { authenticateToken, corsMiddleware };