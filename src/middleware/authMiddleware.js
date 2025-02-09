const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No auth" });
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: "No auth" });
    }
};  