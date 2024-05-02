const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9000;

// Middleware para analizar JSON
app.use(express.json());

// Cors options
const corsOptions = {
    origin: ["http://localhost:9000", "https://www.google.com", "https://123.223.44.1"],
    methods: ["OPTION", "GET", "POST", "PUT", "DELETE"]
};

// Routes
const userRoutes = require('./routes/UserRoutes');
const authRoutes = require('./routes/Auth');
app.use('/api/v1', userRoutes,authRoutes);

// Cors middleware
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('***** Prueba Test NodeJs *****');
});

// Inicio del server
app.listen(port, () => {
    console.log('Server listening on port', port);
});
