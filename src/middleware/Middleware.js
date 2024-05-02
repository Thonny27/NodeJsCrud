function validateToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ");
        const token = bearerToken[1];
        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = {
    validateToken: validateToken
};
