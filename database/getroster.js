const models = require('../models')

async function getRoster(id) {
    const user = await models.User.findAll({
        include: [
            {
                model: models.Company,
                as: 'companies',
                where: {
                    id: id
                },
                through: {
                    model: models.User_Company,
                    as: 'usercompanies',
                    where: {
                        isdelivery: true
                    }
                }
            }
        ]
    })
    return user
}

module.exports = getRoster