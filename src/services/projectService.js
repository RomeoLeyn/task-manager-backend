const { Project, User, ProjectMembers } = require("../models/models");
const ApiError = require("../error/apiError");


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
        try {
            const { id } = req.params;
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
        try {

            const addedByUserId = req.user.id;
            const { projectId, userId } = req.params;

            const projectMember = await ProjectMembers.findOne({ where: { projectId, userId } });

            if(projectMember) {
                return res.status(400).json({message: 'User already added to the project'});
            }

            const user = await User.findOne({ where: { id: userId } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const project = await Project.findOne({ where: { id: projectId } });

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const member = await ProjectMembers.create({ projectId, userId, addedByUserId });

            return res.status(200).json(member);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

}

module.exports = new ProjectService();