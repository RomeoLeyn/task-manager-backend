const jwt = require('jsonwebtoken');

const generateJwt = (id, email, status) => {
    return jwt.sign(
        { id, email, status },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = { generateJwt, verifyToken };