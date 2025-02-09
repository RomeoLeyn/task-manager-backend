class UserController {

    constructor(userService) {
        this.userService = userService;
    };

    async register(req, res) {
        try {
            const userData = req.body;
            const token = await this.userService.register(userData);
            return res.status(201).json(token);
        } catch (error) {
            return res.status(400).json(error.message);
        };
    };

    async login(req, res) {
        try {
            const userData = req.body;
            const token = await this.userService.login(userData);
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(400).json(error.message);
        };
    };

    async update(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const user = await this.userService.update(id, userData);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error.message);
        };
    };

    async searchUserByName(req, res) {
        try {
            const { username } = req.params;
            const user = await this.userService.searchUserByName(username);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json(error.message);
        };
    };

    async verifyEmail(req, res) {
        try {
            const emailToken = req.query.emailToken;
            const user = await this.userService.verifyEmail(emailToken);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error.message);
        };
    };

    async addImprotant(req, res) {
        try {
            const userId = req.user.id;
            const projectId = req.query.projectId;
            const importantProject = this.userService.addImprotant(userId, projectId);
            res.status(200).json(importantProject);
        } catch (error) {
            res.status(400).json(error.message);
        };
    };

    async getImprotant(req, res) {
        try {
            const userId = req.user.id;

            const importantProjects = await this.userService.getImprotant(userId);

            res.status(200).json(importantProjects);

        } catch (error) {
            res.status(400).json(error.message);
        };
    };

    async deleteImportant(req, res) {
        try {
            const userId = req.user.id;
            const projectId = req.query.projectId;

            const deletedImportantProject = await this.userService.deleteImportant(userId, projectId);

            return res.status(200).json(deletedImportantProject);
        } catch (error) {
            return res.status(400).json(error.message);
        };
    };
}


module.exports = UserController;