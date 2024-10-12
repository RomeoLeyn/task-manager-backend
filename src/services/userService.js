const { User } = require('../models/models');
const ApiError = require('../error/apiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate } = require('../db/db');
const CreateUserDTO = require('../DTOs/CreateUserDTO');


const generateJwt = (id, email, status) => {
    return jwt.sign(
        { id, email, status },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

class UserController {
    async registation(req, res, next) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return next(res.status(400).json({ message: 'Not all fields are filled' }));
            }

            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                return next(res.status(400).json({ message: 'User with this email already exists' }));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ username, email, password: hashPassword });

            const token = generateJwt(user.id, user.email, user.status);
            return res.status(201).json({ token });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return res.status(400).json({ message: 'Wrong password' });
            }

            const token = generateJwt(user.id, user.email, user.status);

            return res.status(200).json({ token });

        } catch (error) {
            return res.status(404).json(error);
        }
    }
}

module.exports = new UserController();