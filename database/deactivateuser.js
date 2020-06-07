const models = require('../models')

async function deactivateUser(permissionsid) {
    await models.User_Company.destroy({
        where: {
            id: permissionsid
        }
    })
}

module.exports = deactivateUser