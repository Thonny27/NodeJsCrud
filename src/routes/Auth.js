// auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/authorization', (req, res) => {
    const user = { id: 1 };
    const token = jwt.sign({ user }, 'secret');
    res.json({ token });
});

module.exports = router;
