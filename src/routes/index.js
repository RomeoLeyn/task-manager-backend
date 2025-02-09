const express = require('express');

module.exports = (userController, projectController, taskController, authMiddleware, checkMembershipMiddleware, checkRoleInProjectMiddleware) => {
    const router = express.Router();

    router.use('/users', require('./user')(userController, authMiddleware));
    router.use('/projects', require('./project')(projectController, authMiddleware, checkMembershipMiddleware, checkRoleInProjectMiddleware));
    router.use('/tasks', require('./task')(taskController, authMiddleware, checkMembershipMiddleware));

    return router;
}