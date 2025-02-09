const projectService = require("../services/projectService");

class ProjectConstroller {

    constructor(projectService) {
        this.projectService = projectService;
    }

    async create(req, res) {
        try {
            const userId = req.user.id;
            const projectData = req.body;
            const project = await this.projectService.create(projectData, userId);
            return res.status(201).json(project);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async getProjects(req, res) {
        try {
            const projects = await this.projectService.getProjects(req.user.id);
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async getProjectsTest(req, res) {
        try {
            const projects = await this.projectService.getProjectsTest();
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async getProjectById(req, res) {
        try {
            const { projectId } = req.params;
            const project = await this.projectService.getProjectById(projectId);
            return res.status(200).json(project);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async getProjectByIdTest(req, res) {
        try {
            const { projectId } = req.params;
            const project = await this.projectService.getProjectByIdTest(projectId);
            return res.status(200).json(project);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async addMember(req, res) {
        try {
            const addedByUserId = req.user.id;
            const briefData = req.params;
            const newMemerb = await this.projectService.addMember(addedByUserId, briefData);
            return res.status(200).json(newMemerb);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = ProjectConstroller;