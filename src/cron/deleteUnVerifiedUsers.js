const cron = require('node-cron');
const User = require('../models/models').User;
const { Op } = require('sequelize');

cron.schedule('0 0 * * *', async () => {
    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

    try {
        const deletedUsers = await User.destroy(
            {
                where: {
                    isVerifiedEmail: false,
                    createdAt: {
                        [Op.lt]: sixHoursAgo
                    }
                }
            }
        )

    } catch (error) {
        console.error(error.message);        
    }
})