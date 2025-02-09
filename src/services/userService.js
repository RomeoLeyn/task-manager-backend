const { emailSend } = require('../events/userEvents');
const { MAX_IMPORTANT_PROJECTS_VALUE } = require('../constants/constants');
const { generateJwt } = require('../utils/jwt');

const bcrypt = require('bcrypt');
const crypto = require("crypto");


class UserService {

    constructor(UserModel, UserImportantProjectsModel, ProjectModel) {
        this.User = UserModel;
        this.UserImportantProjects = UserImportantProjectsModel;
        this.Project = ProjectModel;
    };

    async register(userData) {
        const emailToken = crypto.randomBytes(64).toString("hex");

        if (!userData.username || !userData.email || !userData.password) {
            throw new Error('Not all fields are filled');
        };

        const candidate = await this.User.findOne({ where: { email: userData.email } });

        if (candidate) {
            throw new Error("User with this email already exists");
        };

        const hashPassword = await bcrypt.hash(userData.password, 5);

        const user = await this.User.create({ username: userData.username, email: userData.email, password: hashPassword, emailToken });

        emailSend(userData.email, 'Registration', emailToken);

        const token = generateJwt(user.id, user.username, user.avatarUrl, user.email, user.status);

        return token;
    };

    async login(userData) {
        const user = await this.User.findOne({ where: { email: userData.email } });

        if (user == null) {
            throw new Error('User not found');
        };

        let comparePassword = bcrypt.compareSync(userData.password, user.password);
        if (!comparePassword) {
            throw new Error('Wrong password');
        };

        const token = generateJwt(user.id, user.username, user.avatarUrl, user.email, user.status);

        if (!token) {
            throw new Error('Token not created');
        };

        return token;
    }

    // TODO bug fix
    async update(id, userData) {
        const user = await this.User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        };

        const hashPassword = await bcrypt.hash(userData.password, 5);
        const updateUser = await this.User.update({ usernmae: userData.username, email: userData.email, password: hashPassword, updatedAt: new Date() }, { where: { id } });

        return updateUser;
    };

    async searchUserByName(username) {
        const user = await this.User.findOne({
            where: { username },
            attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'avatarUrl']
        });

        if (!user) {
            throw new Error('User not found');
        };

        return user;
    };

    async verifyEmail(emailToken) {
        if (!emailToken) {
            throw new Error('Email token not found');
        };

        let user = await this.User.findOne({
            where: {
                emailToken
            }
        });

        if (!user) {
            throw new Error('User not found');
        };

        const updatedUser = await this.User.update(
            { status: "active", isVerifiedEmail: true, emailToken: null },
            { where: { emailToken: emailToken } }
        );

        return updatedUser;
    };

    async addImprotant(userId, projectId) {
        const importantProjects = await this.UserImportantProjects.findAll({ where: { userId } });

        if (importantProjects.length >= MAX_IMPORTANT_PROJECTS_VALUE) {
            throw new Error('You can not add more than 5 projects');
        };

        const sameProject = importantProjects.find(project => Number(project.projectId) === Number(projectId));

        if (sameProject) {
            throw new Error("You can't add the same project twice");
        };

        const importantProject = await this.UserImportantProjects.create({ projectId, userId });
        return importantProject;
    };

    async getImprotant(userId) {

        if (!userId) {
            throw new Error('User not found');
        };

        const importantProjects = await this.UserImportantProjects.findAll({
            where: { userId: userId },
            include: [
                {
                    model: this.Project,
                    attributes: ['id', 'title', 'description', 'category', 'color']
                }
            ]
        });

        return importantProjects;
    };

    async deleteImportant(userId, projectId) {

        if (!userId || !projectId) {
            throw new Error('Not all fields are filled');
        };

        const deletedImportantProject = await this.UserImportantProjects.destroy({ where: { userId, projectId } });
        return deletedImportantProject;
    };
}

module.exports = UserService;