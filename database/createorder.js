const models = require('../models')

async function createOrder(order) {
    const newOrder = models.Order.build(order)
    await newOrder.save()
}

module.exports = createOrder