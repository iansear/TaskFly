const models = require('../models')

async function getUserProfile(username) {
    const user = await models.User.findOne({
        where: {
            username: username
        },
        include: [
            {
                model: models.Company,
                as: 'companies',
                through: {
                    model: models.User_Company,
                    as: 'usercompanies'
                }
            }
        ]
    })
    return user
}

module.exports = getUserProfile