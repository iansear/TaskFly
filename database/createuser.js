const models = require('../models')

async function createUser(user, permissions) {
    const newUser = models.User.build(user)
    const savedUser = await newUser.save()
    permissions = {
        ...permissions,
        userid: savedUser.id,
    }
    const newUserCompany = models.User_Company.build(permissions)
    await newUserCompany.save()
}

module.exports = createUser