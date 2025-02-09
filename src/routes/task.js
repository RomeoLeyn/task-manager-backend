const express = require('express');

module.exports = (taskController, authMiddleware, checkMembershipMiddleware) => {
    const router = express.Router();

    router.post('/', authMiddleware, (req, res) => taskController.create(req, res));
    router.post('/assign', authMiddleware, (req, res) => taskController.assignedTask(req, res));

    router.get('/:projectId', authMiddleware, checkMembershipMiddleware, (req, res) => taskController.getTasksByProjectId(req, res));
    router.get('/details/:taskId', authMiddleware, (req, res) => taskController.getTaskDetails(req, res));

    return router;
};