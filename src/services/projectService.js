const { Project, User, ProjectMembers } = require("../models/models");
const ApiError = require("../error/apiError");
const { Op } = require("sequelize");
const { model } = require("../db/db");

class ProjectService {
    async create(req, res) {
        try {
            const userId = req.user.id;
            const { title, description, category, color } = req.body;
            const created = await Project.create({ title, description, category, createdByUserId: userId, color });
            const projectOfThePracticipant = await ProjectMembers.create({ userId, projectId: created.id, role: 'owner' });
            return res.status(201).json({ created, projectOfThePracticipant });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, description } = req.body;
            const [updated] = await Project.update({ title, description }, { where: { id } });
            if (updated) {
                const updatedProject = await Project.findOne({ where: { id } });
                return res.status(200).json(updatedProject);
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    /**
     * @function getProjects
     * @description Gets all projects of the current user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     * @throws {ApiError}
     */
    async getProjects(req, res) {
        try {
            const id = req.user.id;

            const projectsOfTheParticipant = await ProjectMembers.findAll({ where: { userId: id } });

            const projects = await Project.findAll(
                {
                    where: {
                        id: projectsOfTheParticipant.map(project => project.projectId)
                    },
                    include: [
                        {
                            model: User,
                            as: 'members',
                            through: { attributes: ['role'] },
                            attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'avatarUrl']
                        }
                    ],
                    attributes: ['id', 'title', 'description', 'updatedAt', 'createdAt', 'category']
                }
            );

            return res.status(200).json(projects);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getProjectById(req, res) {
        const { id } = req.params;
        try {
            const project = await Project.findOne(
                {
                    where: { id },
                    include: [
                        {
                            model: User,
                            as: 'members',
                            through: { attributes: ['role'] },
                            attributes: ['id', 'username', 'firstName', 'lastName', 'avatarUrl']
                        }
                    ],
                    attributes: ['id', 'title', 'description', 'updatedAt', 'createdAt', 'category']
                });

            return res.status(200).json(project);

        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async addMember(req, res) {
        const { userId, projectId } = req.params;

        try {
            const member = await ProjectMembers.create({ userId, projectId });
            return res.status(200).json(member);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

}

module.exports = new ProjectService();