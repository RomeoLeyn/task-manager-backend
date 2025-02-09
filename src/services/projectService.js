class ProjectService {

    constructor(ProjectModel, UserModel, ProjectMembersModel) {
        this.Project = ProjectModel;
        this.User = UserModel;
        this.ProjectMembers = ProjectMembersModel;
    };

    async create(projectData, userId) {
        const candidate = await this.User.findOne({ where: { id: userId } });

        if (!candidate) {
            throw new Error('User not found');
        };

        const created = await this.Project.create({ title: projectData.title, description: projectData.description, createdAt: new Date(), category: projectData.category, createdByUserId: userId, color: projectData.color });
        const projectOfThePracticipant = await this.ProjectMembers.create({ userId, projectId: created.id, role: 'owner', addedByUserId: userId });
        return { created, projectOfThePracticipant };
    };

    async update(id, title, description) {
        const [updated] = await this.Project.update({ title, description }, { where: { id } });
        if (updated) {
            const updatedProject = await this.Project.findOne({ where: { id } });
            return updatedProject;
        };
    };

    async getProjects(userId) {

        if (!userId) {
            throw new Error('User not found');
        };

        const projectsOfTheParticipant = await this.ProjectMembers.findAll({ where: { userId: userId } });
        const projects = await this.Project.findAll(
            {
                where: {
                    id: projectsOfTheParticipant.map(project => project.projectId)
                },
                include: [
                    {
                        model: this.User,
                        as: 'members',
                        through: { attributes: ['role'] },
                        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'avatarUrl']
                    }
                ],
                attributes: ['id', 'title', 'description', 'updatedAt', 'createdAt', 'category', 'color']
            }
        );

        if (!projects) {
            throw new Error('Projects not found');
        };

        return projects;
    };

    async getProjectsTest() {
        const projects = await this.Project.findAll(
            {
                include: [
                    {
                        model: this.User,
                        as: 'members',
                        through: { attributes: ['role'] },
                        attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'avatarUrl']
                    }
                ],
                attributes: ['id', 'title', 'description', 'updatedAt', 'createdAt', 'category', 'color']
            }
        );

        return projects;
    };

    async getProjectById(id) {

        const project = await this.Project.findOne(
            {
                where: { id },
                include: [
                    {
                        model: this.User,
                        as: 'members',
                        through: { attributes: ['role'] },
                        attributes: ['id', 'username', 'firstName', 'lastName', 'avatarUrl']
                    }
                ],
                attributes: ['id', 'title', 'description', 'updatedAt', 'createdAt', 'category']
            });

        if (!project) {
            throw new Error('Project not found');
        };

        return project;
    };


    async getProjectByIdTest(id) {

        const project = await this.Project.findOne(
            {
                where: { id },
                attributes: ['id', 'title', 'description', 'updatedAt', 'createdAt', 'category']
            });

        if (!project) {
            throw new Error('Project not found');
        };

        return project;
    };

    async addMember(addedByUserId, briefData) {

        const { projectId, userId } = briefData;

        const projectMember = await this.ProjectMembers.findOne({ where: { projectId, userId } });

        if (projectMember) {
            throw new Error('User already added to the project');
        };

        const user = await this.User.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found');
        };

        const project = await this.Project.findOne({ where: { id: projectId } });

        if (!project) {
            throw new Error('Project not found');
        };

        const newMember = await this.ProjectMembers.create({ projectId, userId, addedByUserId });

        return newMember;
    };

}

module.exports = ProjectService;