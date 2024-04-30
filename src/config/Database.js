require('dotenv').config(); // Cargar las variables de entorno desde .env

const express = require('express');
const UserRoutes = require('./routes/user');
const Database = require('./config/Database');
const UserController = require('./controllers/UserController');

const app = express();
const port = process.env.PORT || 9000;
const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;
const secretKey = process.env.SECRET_KEY;

const db = new Database(url, dbName);
const userController = new UserController(db);
const userRoutes = new UserRoutes(userController);

app.use(express.json());

app.use('/api', userRoutes.getRouter());

app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

(async () => {
    await db.connect();
    app.listen(port, () => {
        console.log('Server listening on port', port);
    });
})();
