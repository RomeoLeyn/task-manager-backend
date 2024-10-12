const Router = require('express');
const router = new Router();
const taskController = require('../services/taskService');
const authMiddleware = require('../middleware/authMiddleware');

// POST
router.post('/create', authMiddleware, taskController.create);
router.post('/assigned', taskController.assignedTask);

// GET
router.get('/all', authMiddleware, taskController.getTasks);
router.get('/get-assigned/:taskId', authMiddleware, taskController.getAssignedTasksById);
router.get('/get-assigned-user/:userId', authMiddleware, taskController.getAssignedTasksByUserId);
router.get('/task/:id', authMiddleware, taskController.getTaskById);
router.get('/project/tasks/:projectId', authMiddleware, taskController.getTasksByProjectId);

// UPDATE
router.put('/update/:id', authMiddleware, taskController.update);

// DELETE   
router.delete('/delete/:id/:status', authMiddleware, taskController.deleteTask);

module.exports = router;