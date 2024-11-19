const Router = require('express');
const router = new Router();

const taskRouter = require('./taskController');
const projectRouter = require('./projectController');
const userRouter = require('./userController');

router.use('/projects', projectRouter);
router.use('/tasks', taskRouter);
router.use('/users', userRouter);

module.exports = router;    