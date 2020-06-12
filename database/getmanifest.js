const models = require('../models')
const {Op} = require('sequelize')

async function getManifest(userid) {
    const orders = await models.Order.findAll({
        where: {
            userid: userid,
            [Op.not]: [{status: 'DELIVERED'}]
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

module.exports = getManifest