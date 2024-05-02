const express = require('express');
const router = express.Router();
const { connectDB } = require('../config/Database');
const jwt = require('jsonwebtoken');
const { validateToken } = require('../middleware/Middleware');
const { ObjectId } = require('mongodb');

// Middleware para conectar a la base de datos antes de cada solicitud
router.use(async (req, res, next) => {
    try {
        req.db = await connectDB();
        next();
    } catch (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Obtener todos los usuarios
router.get('/jobs', validateToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            console.log(req.token);
            res.sendStatus(403);
        } else {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const skip = (page - 1) * pageSize;
            
            try {
                const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
                const users = await req.db.collection('jobs')
                    .find()
                    .skip(skip)
                    .limit(pageSize)
                    .sort({name: sortOrder})
                    .toArray();
                    setTimeout(() => {
                        res.json(users);
                    }, 1000); 
            } catch (err) {
                console.error('Error getting users:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    });
});

// Obtener un usuario por ID
router.get('/job/find/:id', validateToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            console.log(req.token);
            res.sendStatus(403);
        } else {
            const userId = req.params.id;
            try {
                const user = await req.db.collection('jobs').findOne({ _id: new ObjectId(userId) });
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
router.post('/job/new', validateToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            console.log(req.token);
            res.sendStatus(403);
        } else {
            const newUser = req.body;
            try {
                const result = await req.db.collection('jobs').insertOne(newUser);
                res.json(result);
            } catch (err) {
                console.error('Error creating user:', err);
                res.status(500).json({ message: 'Internal server error', error: err.message });
            }
        }
    });
});

// Actualizar un usuario por ID
router.put('/job/update/:id', validateToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            console.log(req.token);
            res.sendStatus(403);
        } else {
            const userId = req.params.id;
            const updatedUser = req.body;
            try {
                const result = await req.db.collection('jobs').updateOne({ _id: new ObjectId(userId) }, { $set: updatedUser });
                res.json(result);
            } catch (err) {
                console.error('Error updating user:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    });
});

// Eliminar un usuario por ID
router.delete('/job/delete/:id', validateToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            console.log(req.token);
            res.sendStatus(403);
        } else {
            const userId = req.params.id;
            try {
                const result = await req.db.collection('jobs').deleteOne({ _id: new ObjectId(userId) });
                res.json(result);
            } catch (err) {
                console.error('Error deleting user:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    });
});

module.exports = router;
