const { Project, User, Task } = require("../models/models");
const ApiError = require("../error/apiError");
const { Op } = require("sequelize");
const ProjectDTO = require("../DTOs/projectDTO");

class ProjectController {
    async create(req, res) {
        try {
            const { title, description, createdByUserId } = req.body;
            const created = await Project.create({ title, description, createdByUserId });
            return res.status(201).json(created);
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

    async getProjects(req, res) {

        const id = req.user.id;

        try {
            const projects = await Project.findAll(
                {
                    where: {
                        members: {
                            [Op.contains]: [id]
                        },
                    },
                    attributes: ['id', 'title', 'description'],
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
                    // include:
                    //     [
                    //         {
                    //             model: User,
                    //             as: 'user',
                    //             attributes: ['id', 'username']
                    //         },
                    //         {
                    //             model: Task,
                    //             as: 'tasks',
                    //             attributes: ['id', 'title', 'description', 'status', 'priority', 'dueDate', 'createdByUserId', 'assignedUserId'],
                    //             include: [
                    //                 {
                    //                     model: User,
                    //                     as: 'user',
                    //                     attributes: ['id', 'username']
                    //                 }
                    //             ]
                    //         }
                    //     ],
                });

            const createdByUser = await User.findOne({
                where: {
                    id: project.createdByUserId
                }
            });

            const members = await User.findAll({
                where: {
                    id: {
                        [Op.in]: project.members
                    }
                }
            });

            const projectDTO = new ProjectDTO(project, createdByUser, members);

            // return res.status(200).json({ project, members });
            return res.status(200).json(projectDTO);
            // return res.status(200).json(project);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async addMember(req, res) {
        const { userId, projectId } = req.params;
        try {

            const project = await Project.findByPk(projectId);

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            if (!Array.isArray(project.members)) {
                project.members = [];
            }

            const numericUserId = parseInt(userId, 10);

            if (!project.members.includes(numericUserId)) {
                const updatedMembers = [...project.members, numericUserId];
                project.set('members', updatedMembers);
            } else {
                return res.status(400).json({ message: 'User is already a member of the project' });
            }


            await project.save();
            return res.status(200).json(project);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = new ProjectController();