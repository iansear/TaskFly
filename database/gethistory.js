const models = require('../models')

async function getHistory(userid) {
    const orders = await models.Order.findAll({
        where: {
            userid: userid,
            status: 'DELIVERED'
        },
        include: [
            {
                model: models.Company,
                as: 'company'
            }
        ]
    })
    return orders
}

module.exports = getHistory