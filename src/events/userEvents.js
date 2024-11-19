const evenetEmmiter = require('../events/eventEmmiter');

require('./listeners/userListeners');

module.exports = {
    emailSend: (email, message, emailToken) => {
        evenetEmmiter.emit('userRegistered', email, message, emailToken);
    }
}