const Router = require('express');
const router = new Router();
const userController = require('../services/userService');
const authMiddleware = require('../middleware/authMiddleware');

// POST
router.post('/registration', userController.registation);
router.post('/login', userController.login);

// GET

// UPDATE

// DELETE 

module.exports = router;