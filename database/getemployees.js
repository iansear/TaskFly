const models = require('../models')

async function getEmployees(id) {
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
                    as: 'usercompanies'
                }
            }
        ]
    })
    return user
}

module.exports = getEmployees