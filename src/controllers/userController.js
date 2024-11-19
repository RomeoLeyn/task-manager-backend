const Router = require('express');
const router = new Router();
const userService = require('../services/userService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userService.register);
router.post('/login', userService.login);
router.post('/important', authMiddleware, userService.addImprotant);

router.get('/search', authMiddleware, userService.searchUserByName);
router.get('/verify-email', userService.verifyEmail);
router.get('/important-projects', authMiddleware, userService.getImprotant);

router.put('/update', authMiddleware, userService.update);

module.exports = router;