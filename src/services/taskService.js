const axios = require('axios');
const { Task, AssignedTask, User, Project } = require('../models/models');
const ApiError = require('../error/apiError');
const { model } = require('../db/db');
const { Op } = require('sequelize');
const TaskDTO = require('../DTOs/taskDTO');

class TaskService {
    async create(req, res) {
        try {
            const userId = req.user.id;

            const { title, description, status, priority, dueDate, projectId } = req.body;

            const project = await Project.findOne({
                where: {
                    id: projectId
                }
            });

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const created = await Task.create({ title, description, status, priority, dueDate, projectId, createdByUserId: userId });

            return res.status(201).json(created);
        } catch (error) {
            return res.status(500).json(error.message);
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

    async assignedTask(req, res) {
        try {
            const userId = req.user.id;
            const { taskId, status } = req.body;
            const task = await AssignedTask.create({ taskId, userId, status });

            return res.status(200).json(task);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getTasksByProjectId(req, res) {
        try {
            const { projectId } = req.params;
            const tasks = await Task.findAll(
                {
                    where: { projectId: projectId },
                    include: [
                        {
                            model: Project,
                            as: 'project',
                            attributes: ['id', 'title', 'description'],
                            include: [
                                {
                                    model: User,
                                    as: 'createdByUser',
                                    attributes: ['id', 'username', 'email']
                                }
                            ]
                        },
                        {
                            model: User,
                            as: 'assignedUser',
                            attributes: ['id', 'username', 'email']
                        },
                        {
                            model: User,
                            as: 'createdByUser',
                            attributes: ['id', 'username', 'email']
                        }
                    ]
                }
            );

            return res.status(200).json(tasks);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = new TaskService();