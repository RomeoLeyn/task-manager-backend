const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
    projectStatus: { type: DataTypes.ENUM('owner', 'co_owner', 'member'), allowNull: false, defaultValue: 'member' },
}, { timestamps: false });

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }, 
    taskId: { type: DataTypes.INTEGER, allowNull: true },  
    projectId: { type: DataTypes.INTEGER, allowNull: true }, 
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { timestamps: false });


const Project = sequelize.define('project', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    createdByUserId: { type: DataTypes.INTEGER, allowNull: false },
    members: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: true, defaultValue: [] }, 
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
    assignedUserId: { type: DataTypes.INTEGER, allowNull: false },
    createdByUserId: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });


const AssignedTask = sequelize.define('assigned_task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    taskId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('assigned'), allowNull: false },
}, { timestamps: false });


User.hasMany(Task, {foreignKey: 'createdByUserId'});
Task.belongsTo(User, { foreignKey: 'createdByUserId' });

User.hasMany(AssignedTask, {foreignKey: 'userId'});
Task.belongsTo(User, { foreignKey: 'assignedUserId' });

Task.hasMany(Comment, { foreignKey: 'id' });
Comment.belongsTo(Task, { foreignKey: 'taskId' });

Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

Project.belongsTo(User, { foreignKey: 'createdByUserId' });
User.hasMany(Project, { as: 'createdProjects', foreignKey: 'createdByUserId' });

User.hasMany(AssignedTask, {foreignKey: 'id'});
AssignedTask.belongsTo(User, { foreignKey: 'userId' });

Task.hasMany(AssignedTask, { as: 'assignedTasks', foreignKey: 'taskId' });
AssignedTask.belongsTo(Task, { as: 'task', foreignKey: 'id' });

module.exports = { Task, AssignedTask, User, Comment, Project };