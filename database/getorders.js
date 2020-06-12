const models = require('../models')
const {Op} = require('sequelize')

async function getOrders(companyid) {
    const orders = await models.Order.findAll({
        where: {
            companyid: companyid,
            [Op.not]: [{status: 'DELIVERED'}]
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