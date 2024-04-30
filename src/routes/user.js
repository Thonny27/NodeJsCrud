const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const jwt  = require('jsonwebtoken');

// Conexión a la base de datos
const url = 'mongodb+srv://pruebanode:Prueb4N0d3@cluster0.6dicmnn.mongodb.net/TestNode?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
const dbName = 'TestNode';

async function connect() {
    try {
        await client.connect();
        console.log('Connected successfully to server');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

// Middleware para conectar a la base de datos antes de cada solicitud
router.use(async (req, res, next) => {
    if (!client.topology || !client.topology.isConnected()) await connect();
    req.dbClient = client;
    req.db = client.db(dbName);
    next();
});

//login
router.post('/autorization', (req,res) =>{
    const user = {id: 1};
    const token = jwt.sign({user}, 'secret');
    res.json({
        token
    })
});


// Obtener todos los usuarios
router.get('/users', validateToken, async (req, res) => {
    jwt.verify(req.token, 'secret', async (err, data) => {
        if (err) {
            console.log(req.token);
            res.sendStatus(403);
        } else {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const skip = (page - 1) * pageSize;
            
            try {
                const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
                const users = await req.db.collection('users')
                    .find()
                    .skip(skip)
                    .limit(pageSize)
                    .sort({name: sortOrder})
                    .toArray();
                res.json(users);
            } catch (err) {
                console.error('Error getting users:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    });
});

// Obtener un usuario por ID
router.get('/users/:id', validateToken, async (req, res) => {
    jwt.verify(req.token, 'secret', async (err, data) => {
        if (err) {
            console.log(req.token);
            res.sendStatus(403);
        } else {
            const userId = req.params.id;
            try {
                const user = await req.db.collection('users').findOne({ _id: new ObjectId(userId) });
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.json(user);
            } catch (err) {
                console.error('Error getting user by ID:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    });
});

// Crear un nuevo usuario
router.post('/users', validateToken, async (req, res) => {
    jwt.verify(req.token, 'secret', async (err, data) => {
        if (err) {
            console.log(req.token);
            res.sendStatus(403);
        } else {
            const newUser = req.body;
            try {
                const result = await req.db.collection('users').insertOne(newUser);
                res.json(result);
            } catch (err) {
                console.error('Error creating user:', err);
                res.status(500).json({ message: 'Internal server error', error: err.message });
            }
        }
    });
});

// Actualizar un usuario por ID
router.put('/users/:id', validateToken, async (req, res) => {
    jwt.verify(req.token, 'secret', async (err, data) => {
        if (err) {
            console.log(req.token);
            res.sendStatus(403);
        } else {
            const userId = req.params.id;
            const updatedUser = req.body;
            try {
                const result = await req.db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: updatedUser });
                res.json(result);
            } catch (err) {
                console.error('Error updating user:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    });
});

// Eliminar un usuario por ID
router.delete('/users/:id', validateToken, async (req, res) => {
    jwt.verify(req.token, 'secret', async (err, data) => {
        if (err) {
            console.log(req.token);
            res.sendStatus(403);
        } else {
            const userId = req.params.id;
            try {
                const result = await req.db.collection('users').deleteOne({ _id: new ObjectId(userId) });
                res.json(result);
            } catch (err) {
                console.error('Error deleting user:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    });
});

function validateToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    //console.log(bearerHeader);
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ");
        const token = bearerToken[1];
        req.token = token;
        next();
    }else{
        res.sendStatus(403);
    }
}

module.exports = router;
