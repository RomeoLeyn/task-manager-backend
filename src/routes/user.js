const express = require('express');

module.exports = (userController, authMiddleware) => {
    const router = express.Router();

    router.post('/register', (req, res) => userController.register(req, res));
    router.post('/login', (req, res) => userController.login(req, res));
    router.post('/important', authMiddleware, (req, res) => userController.addImprotant(req, res));

    router.get('/verify-email', (req, res) => userController.verifyEmail(req, res));
    router.get('/search/:username', authMiddleware, (req, res) => userController.searchUserByName(req, res));
    router.get('/important-projects', authMiddleware, (req, res) => userController.getImprotant(req, res));

    router.put('/update/:id', authMiddleware, (req, res) => userController.update(req, res));

    router.delete('/delete-important', authMiddleware, (req, res) => userController.deleteImportant(req, res));

    return router;
}