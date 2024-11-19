const eventEmitter = require('../eventEmmiter');
const sendEmail = require('../../services/emailService');

eventEmitter.on('userRegistered', (email, message, emailToken) => {
    sendEmail(email, message, emailToken);
})