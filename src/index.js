const express = require('express');
const userRoutes = require('./routes/user')
const app = express();
const port = process.env.PORT || 9000;

// Middleware para analizar JSON
app.use(express.json());

// Rutas
app.use('/api', userRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log('Server listening on port', port);
});
