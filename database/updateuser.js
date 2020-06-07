const models = require('../models')

async function updateUser(userid, user, permissionsid, permissions) {
    await models.User.update(user, {
        where: {
            id: userid
        }
    })
    await models.User_Company.update(permissions, {
        where: {
            id: permissionsid
        }
    })
}

module.exports = updateUser