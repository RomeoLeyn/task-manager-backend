const axios = require('axios');
const { Task, AssignedTask, Project, User } = require('../models/models');
const ApiError = require('../error/apiError');
const { model } = require('../db/db');
const { Op } = require('sequelize');

class TaskController {
    async create(req, res) {
        try {
            const { title, description, status, priority, dueDate, projectId, assignedUserId, createdByUserId } = req.body;

            const project = await Project.findOne({ where: { id: projectId } });
            console.log(project);

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const created = await Task.create({ title, description, status, priority, dueDate, projectId, assignedUserId, createdByUserId });
            return res.status(201).json(created);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, description, status, priority, dueDate, projectId, assignedUserId, createdByUserId } = req.body;
            const [updated] = await Task.update({ title, description, status, priority, dueDate, projectId, assignedUserId, createdByUserId }, { where: { id } });

            if (updated) {
                const updatedTask = await Task.findOne({ where: { id } });
                return res.status(200).json(updatedTask);
            }

        } catch (error) {
            // ApiError.badRequest(error.message);
            console.log(error);
        }
    }

    async deleteTask(req, res) {
        try {
            const { id, status } = req.params;

            if (status === 'deleted') {
                const deleted = await Task.update({ status: status }, { where: { id } });
                return res.status(200).json(deleted);
            } else {
                return res.status(400).json({ message: 'Task not deleted' });
            }
        } catch (error) {
            ApiError.internal(error.messages);
        }
    }

    async getTasks(req, res) {
        const tasks = await Task.findAll({
            include:
                [
                    {
                        model: Project,
                        as: 'project',
                        attributes: ['id', 'title', 'description'],
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['id', 'username', 'email']
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    }
                ]
        });
        res.json(tasks);
    }

    async assignedTask(req, res) {
        const { taskId, userId, status } = req.body;
        const tasks = await AssignedTask.create({ taskId, userId, status });
        return res.json(tasks);
    }

    async getTaskById(req, res) {
        const { id } = req.params;
        const task = await Task.findOne({
            where: { id },
            include:
                [
                    {
                        model: Project,
                        as: 'project',
                        attributes: ['id', 'title', 'description'],
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['id', 'username', 'email']
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    }
                ]
        });
        return res.status(200).json(task);
    }

    async getAssignedTasksById(req, res) {
        const { taskId } = req.params;
        const tasks = await AssignedTask.findOne({
            where: { taskId },
            include:
                [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: Task,
                        as: 'task',
                        attributes: ['id', 'title', 'description'],
                    }
                ]
        });
        return res.json(tasks);
    }

    async getAssignedTasks(req, res) {
        try {
            const tasks = await AssignedTask.findAll({ where: { status: 'assigned' } });
            return res.status(200).json(tasks);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async getAssignedTasksByUserId(req, res) { // TODO fix bugs
        const { userId } = req.params;
        const tasks = await AssignedTask.findAll({
            where: { userId },
            include:
                [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: Task,
                        as: 'task',
                        attributes: ['id', 'title', 'description'],
                    }
                ]
        });
        // const userInfo = await axios.get(`http://localhost:3000/users/${userId}`); // TODO
        return res.json(tasks);
    }

    async getTasksByProjectId(req, res) {
        try {
            const { projectId } = req.params;
            const tasks = await Task.findAll(
                {
                    where: { projectId },
                    include:
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    }
                }
            );
            return res.status(200).json(tasks);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = new TaskController();