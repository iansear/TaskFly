const models = require('../models')

async function addUser(permissions) {
    const newUserCompany = await models.User_Company.build(permissions)
    await newUserCompany.save()
}

module.exports = addUser