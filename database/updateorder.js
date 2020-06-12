const models = require('../models')

async function updateOrder(orderid, order) {
    await models.Order.update(order, {
        where: {
            id: orderid
        }
    })
}

module.exports = updateOrder