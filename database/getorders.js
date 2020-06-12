const models = require('../models')

async function getOrders(companyid) {
    const orders = await models.Order.findAll({
        where: {
            companyid: companyid
        },
        include: [
            {
                model: models.User,
                as: 'user'
            },
            {
                model: models.Company,
                as: 'company'
            }
        ]
    })
    return orders
}

module.exports = getOrders