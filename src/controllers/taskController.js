const Router = require('express');
const router = new Router();
const taskController = require('../services/taskService');
const authMiddleware = require('../middleware/authMiddleware');

// POST
router.post('/create', authMiddleware, taskController.create);
router.post('/assigned', authMiddleware, taskController.assignedTask);

// GET
router.get('/tasks', authMiddleware, taskController.getTasks);
router.get('/project/:id', authMiddleware, taskController.getTasksByProjectId);

// UPDATE
router.put('/update/:id', authMiddleware, taskController.update);

// DELETE   
router.delete('/delete/:id/:status', authMiddleware, taskController.deleteTask);

module.exports = router;