// auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/authorization', (req, res) => {
    const user = { id: 1 };
    const token = jwt.sign({ user }, process.env.SECRET_KEY);
    res.json({ token });
});

module.exports = router;
