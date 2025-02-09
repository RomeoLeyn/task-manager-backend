const express = require('express');

module.exports = (projectController, authMiddleware, checkMembershipMiddleware, checkRoleInProjectMiddleware) => {
    const router = express.Router();

    router.post('/', authMiddleware, (req, res) => projectController.create(req, res));
    router.post('/:projectId/members/:userId', authMiddleware, checkRoleInProjectMiddleware, (req, res) => projectController.addMember(req, res));

    router.get('/', authMiddleware, (req, res) => projectController.getProjects(req, res));
    router.get('/:projectId', authMiddleware, checkMembershipMiddleware, (req, res) => projectController.getProjectById(req, res));


    router.get('/test', (req, res) => projectController.getProjectsTest(req, res));
    router.get('/test/:projectId', (req, res) => projectController.getProjectByIdTest(req, res));

    return router;
}