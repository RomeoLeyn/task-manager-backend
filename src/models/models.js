const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    avatarUrl: { type: DataTypes.STRING, allowNull: true, },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('active', 'not_active', 'blocked', 'deleted'), allowNull: false, defaultValue: 'not_active' },
    isVerifiedEmail: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    emailToken: {type: DataTypes.STRING, allowNull: true}, 
}, { timestamps: false });

const Project = sequelize.define('project', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.ENUM('DEVELOPMENT', 'DESIGN', 'MARKETING', 'FINANCE', 'SALES'), allowNull: false },
    color: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    createdByUserId: { type: DataTypes.INTEGER, allowNull: false },
})

const Task = sequelize.define('task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('todo', 'in_progress', 'review', 'done', 'deleted'), allowNull: false },
    priority: { type: DataTypes.ENUM('low', 'medium', 'high'), allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    projectId: { type: DataTypes.INTEGER, allowNull: false },
    assignedUserId: { type: DataTypes.INTEGER, allowNull: true },
    createdByUserId: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

const AssignedTask = sequelize.define('assigned_task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    taskId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('assigned'), allowNull: false },
}, { timestamps: false });

const ProjectMembers = sequelize.define('project_members_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, references:
        {
            model: User,
            key: 'id'
        }
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Project,
            key: 'id'
        }
    },
    role: { type: DataTypes.ENUM('owner', 'co_owner', 'member'), allowNull: false, defaultValue: 'member' },
    added: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { timestamps: false });

const Comment = sequelize.define('comments', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    taskId: { type: DataTypes.INTEGER, allowNull: true },
    projectId: { type: DataTypes.INTEGER, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { timestamps: false });

// TODO create board table for saving background image

User.hasMany(Task, { foreignKey: 'createdByUserId' });
Task.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdByUserId' });

User.hasMany(AssignedTask, { foreignKey: 'userId' });
Task.belongsTo(User, { as: 'assignedUser', foreignKey: 'assignedUserId' });

Task.hasMany(Comment, { foreignKey: 'id' });
Comment.belongsTo(Task, { foreignKey: 'taskId' });

Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

Project.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdByUserId' });
User.hasMany(Project, { as: 'createdProjects', foreignKey: 'createdByUserId' });

Project.belongsToMany(User, { through: ProjectMembers, as: 'members' });
User.belongsToMany(Project, { through: ProjectMembers, as: 'projects' });

User.hasMany(AssignedTask, { foreignKey: 'id' });
AssignedTask.belongsTo(User, { foreignKey: 'userId' });

Task.hasMany(AssignedTask, { as: 'assignedTasks', foreignKey: 'taskId' });
AssignedTask.belongsTo(Task, { as: 'task', foreignKey: 'id' });

module.exports = { Task, AssignedTask, User, Comment, Project, ProjectMembers };