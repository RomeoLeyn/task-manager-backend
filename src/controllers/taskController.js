const Router = require('express');
const router = new Router();
const taskController = require('../services/taskService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, taskController.create);
router.post('/assign', authMiddleware, taskController.assignedTask);

router.get('/:projectId', authMiddleware, taskController.getTasksByProjectId);

router.put('/:id', authMiddleware, taskController.update);

router.delete('/delete/:id/:status', authMiddleware, taskController.deleteTask);

module.exports = router;