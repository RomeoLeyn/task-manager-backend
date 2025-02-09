class TaskService {

    constructor(TaskModel, AssignedTaskModel, UserModel, ProjectModel) {
        this.Task = TaskModel;
        this.AssignedTask = AssignedTaskModel;
        this.User = UserModel;
        this.Project = ProjectModel;
    };

    async create(userId, taskData) {

        const { title, description, status, priority, projectId } = taskData;

        const project = await this.Project.findOne({
            where: {
                id: taskData.projectId
            }
        });

        if (!project) {
            throw new Error('Prject not found');
        }

        const created = await this.Task.create({ title, description, status, priority, dueDate: new Date(), projectId, createdByUserId: userId });

        return created;
    };

    async update(req, res) {
        const { id } = req.params;
        const { title, description, status, priority, dueDate, projectId, assignedUserId, createdByUserId } = req.body;
        const [updated] = await this.Task.update({ title, description, status, priority, dueDate, projectId, assignedUserId, createdByUserId }, { where: { id } });

        if (updated) {
            const updatedTask = await this.Task.findOne({ where: { id } });
            return res.status(200).json(updatedTask);
        }
    };

    async deleteTask(id, status) {
        const deleted = await this.Task.update({ status: status }, { where: { id } });
        return deleted;
    };

    async assignedTask(userId, briefTaskData) {
        const { projectId, taskId, status } = briefTaskData;

        const assignedTask = await this.AssignedTask.findOne({
            where: {
                taskId,
                userId
            }
        });

        if (assignedTask) {
            throw new Error('Task already assigned');
        };

        const taskExists = await this.Task.findOne({ where: { id: taskId } });
        if (!taskExists) {
            throw new Error('Task does not exist');
        };

        const userExists = await this.User.findOne({ where: { id: userId } });
        if (!userExists) {
            throw new Error('User does not exist');
        };

        const task = await this.AssignedTask.create({ taskId, userId, status });
        const updated = await this.Task.update(
            {
                assignedUserId: userId
            },
            {
                where: { id: taskId }
            }
        );

        return task;
    };

    async getTasksByProjectId(projectId) {
        const tasks = await this.Task.findAll(
            {
                where: { projectId: projectId },
                include: [
                    {
                        model: this.Project,
                        as: 'project',
                        attributes: ['id', 'title', 'description'],
                        include: [
                            {
                                model: this.User,
                                as: 'createdByUser',
                                attributes: ['id', 'username', 'email']
                            }
                        ]
                    },
                    {
                        model: this.User,
                        as: 'assignedUser',
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: this.User,
                        as: 'createdByUser',
                        attributes: ['id', 'username', 'email', 'avatarUrl']
                    }
                ]
            }
        );

        return tasks;
    };

    async getTaskDetails(taskId) {
        const task = await this.Task.findOne(
            {
                where: { id: taskId },
                include: [
                    {
                        model: this.Project,
                        as: 'project',
                        attributes: ['id', 'title', 'description'],
                        include: [
                            {
                                model: this.User,
                                as: 'createdByUser',
                                attributes: ['id', 'username', 'email']
                            }
                        ]
                    },
                    {
                        model: this.User,
                        as: 'assignedUser',
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: this.User,
                        as: 'createdByUser',
                        attributes: ['id', 'username', 'email']
                    }
                ]
            }
        );

        return task;
    };
}

module.exports = TaskService;