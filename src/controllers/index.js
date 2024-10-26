const Router = require('express');
const router = new Router();

const taskRouter = require('./taskController');
const projectRouter = require('./projectController');
const userRouter = require('./userController');

router.use('/project', projectRouter);
router.use('/task', taskRouter);
router.use('/user', userRouter);

module.exports = router;