const Router = require('express');
const router = new Router();
const userService = require('../services/userService');
const authMiddleware = require('../middleware/authMiddleware');

// POST
router.post('/registration', userService.registation);
router.post('/login', userService.login);

// GET
router.get('/find', authMiddleware, userService.findUserByName);
// TODO Delete non-activated users after 12 hours
router.get('/verify-email', userService.verifyEmail);

// UPDATE
router.put('/update', authMiddleware, userService.update);

// DELETE 

module.exports = router;