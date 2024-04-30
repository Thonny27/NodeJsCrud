const express = require("express");
const router = express.Router();
const userSchema = require("../models/user")
const jwt  = require('jsonwebtoken');

router.post('/login', (req,res) =>{
    const user = {id: 1};
    const token = jwt.sign({user}, 'secret');
    res.json({
        token
    })
});

module.exports = router;