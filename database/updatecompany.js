const models = require('../models')

async function updateCompany(companyid, company) {
    await models.Company.update(company, {
        where: {
            id: companyid
        }
    })
}

module.exports = updateCompany