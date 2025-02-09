require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./db/db')
const model = require('./models/models');
const cors = require('cors');

// const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');
const checkMembershipMiddleware = require('./middleware/checkMembershipMiddleware');
const checkRoleInProjectMiddleware = require('./middleware/checkRoleInProjectMiddleware');

const UserService = require('./services/userService');
const UserController = require('./controllers/userController');
const ProjectService = require('./services/projectService');
const ProjectConstroller = require('./controllers/projectController');
const TaskService = require('./services/taskService');
const TaskController = require('./controllers/taskController');


const userService = new UserService(model.User, model.UserImportantProjects, model.Project);
const projectService = new ProjectService(model.Project, model.User, model.ProjectMembers);
const taskService = new TaskService(model.Task, model.AssignedTask, model.User, model.Project);

const userController = new UserController(userService);
const projectController = new ProjectConstroller(projectService);
const taskController = new TaskController(taskService);

const router = require('./routes/index')(userController, projectController, taskController, authMiddleware, checkMembershipMiddleware, checkRoleInProjectMiddleware);

const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

require('./cron/deleteUnVerifiedUsers');

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server running at http://localhost:${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();