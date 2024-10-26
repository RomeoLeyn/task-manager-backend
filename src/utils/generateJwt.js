const generateJwt = (id, email, status) => {
    return jwt.sign(
        { id, email, status },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

module.exports = generateJwt;