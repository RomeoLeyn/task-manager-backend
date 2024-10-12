const Router = require('express');
const router = new Router();
const projectController = require('../services/projectService');
const authMiddleware = require('../middleware/authMiddleware');


// POST
router.post('/create', authMiddleware, projectController.create);
router.post('/add-member/:userId/:projectId', authMiddleware, projectController.addMember);

// GET
router.get('/all', authMiddleware,  projectController.getProjects);
router.get('/id/:id/', authMiddleware, projectController.getProjectById);

// UPDATE
router.put('/update/:id', authMiddleware, projectController.update);

// DELETE 

module.exports = router;