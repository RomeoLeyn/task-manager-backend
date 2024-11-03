const { User, UserImportantProjects, Project } = require('../models/models');
const ApiError = require('../error/apiError');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailService');
const { title } = require('process');


const generateJwt = (id, username, avatarUrl, email, status) => {
    return jwt.sign(
        { id, username, avatarUrl, email, status },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

class UserService {
    async register(req, res, next) {
        try {
            const { username, firstName, lastName, email, password } = req.body;
            const emailToken = crypto.randomBytes(64).toString("hex");

            if (!username || !firstName || !lastName || !email || !password) {
                return next(res.status(400).json({ message: 'Not all fields are filled' }));
            }

            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                return next(res.status(400).json({ message: 'User with this email already exists' }));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ username, firstName, lastName, email, password: hashPassword, emailToken });

            sendEmail(email, 'Registration', emailToken);

            const token = generateJwt(user.id, user.username, user.avatarUrl, user.email, user.status);
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

            const token = generateJwt(user.id, user.username, user.avatarUrl, user.email, user.status);

            return res.status(200).json({ token });

        } catch (error) {
            return res.status(404).json(error);
        }
    }

    async update(req, res) {
        try {
            const id = req.user.id;
            console.log(id);
            const { username, email, password } = req.body;

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const hashPassword = await bcrypt.hash(password, 5);
            await User.update({ username, email, password: hashPassword, updatedAt: new Date() }, { where: { id } });
            return res.status(200).json({ message: 'User updated' });

        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async findUserByName(req, res) {
        try {
            const { username } = req.body;
            const user = await User.findOne({
                where: { username: username },
                attributes: ['id', 'username', 'firstName', 'lastName', 'avatarUrl']
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    }


    // TODO update status to unverfied
    async verifyEmail(req, res) {
        const { emailToken } = req.query;
        if (!emailToken) {
            return res.status(400).json({ status: "Failed", error: "empty request" });
        }
        let user = await User.findOne({ where: { emailToken: emailToken } });

        if (!user) {
            return res.status(404).json({ status: "Failed", error: "User not found" });
        }

        await User.update(
            { status: "active", isVerifiedEmail: true, emailToken: null },
            { where: { emailToken: emailToken } }
        );

        return res.status(200).json({ status: "Active", message: "User verified successfully" });
    }

    async addImprotant(req, res) {
        try {
            const userId = req.user.id;
            const { projectId } = req.body;

            const importantProjects = await UserImportantProjects.findAll({ where: { userId } });

            if (importantProjects.length >= 5) {
                return res.status(400).json({ message: 'You already added 5 projects' });
            }

            const sameProject = importantProjects.find(project => project.projectId === projectId);

            if (sameProject) {
                return res.status(400).json({ message: 'You already added this project' });
            }

            const importantProject = await UserImportantProjects.create({ projectId, userId });
            return res.status(200).json(importantProject);
        } catch (error) {
            return res.status(500).json(error.message);
        }

    }

    async getImprotant(req, res) {
        try {
            const importantProjects = await UserImportantProjects.findAll({
                where: { userId: req.user.id },
                include: [
                    { model: Project, attributes: ['id', 'title', 'description', 'category'] }
                ]
            })

            return res.status(200).json(importantProjects);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async deleteImportant(req, res) {
        const userId = req.user.id;
        const { projectId } = req.body;
        try {
            const deletedImportantProject = await UserImportantProjects.destroy({ where: { userId, projectId } });
            return res.status(200).json(deletedImportantProject);
        } catch (error) {
            return res.status(400).json(error.message);
        }
    }
}

module.exports = new UserService();