const Router = require('express');
const router = new Router();
const projectController = require('../services/projectService');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, projectController.create);
router.post('/:projectId/members/:userId', authMiddleware, projectController.addMember);

router.get('/', authMiddleware, projectController.getProjects);
router.get('/:id/', authMiddleware, projectController.getProjectById);

router.put('/:id', authMiddleware, projectController.update);

module.exports = router;