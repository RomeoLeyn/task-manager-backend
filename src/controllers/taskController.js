const taskService = require("../services/taskService");

class TaskController {

    constructor(taskService) {
        this.taskService = taskService;
    }

    async create(req, res) {
        try {
            const userId = req.user.id;
            const taskData = req.body;
            const created = await this.taskService.create(userId, taskData);
            return res.status(201).json(created);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async deleteTask(req, res) {
        try {
            const { id, status } = req.params;
            const deleted = await this.taskService.deleteTask(id, status);
            return res.status(200).json(deleted);
        } catch (error) {
            return res.status(400).json(error.message);

        }
    }

    async assignedTask(req, res) {
        try {
            const userId = req.user.id;
            const briefTaskData = req.body;
            const task = await this.taskService.assignedTask(userId, briefTaskData);
            return res.status(200).json(task);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getTasksByProjectId(req, res) {
        try {
            const { projectId } = req.params;
            const tasks = await this.taskService.getTasksByProjectId(projectId);
            return res.status(200).json(tasks);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getTaskDetails(req, res) {
        try {
            const { taskId } = req.params;
            const task = await this.taskService.getTaskDetails(taskId);
            return res.status(200).json(task);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = TaskController;