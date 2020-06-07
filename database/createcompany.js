const models = require('../models')

async function createCompany(user, company, permissions) {
    const newUser = models.User.build(user)
    const newCompany = models.Company.build(company)
    const savedUser = await newUser.save()
    const savedCompany = await newCompany.save()
    permissions = {
        ...permissions,
        userid: savedUser.id,
        companyid: savedCompany.id
    }
    const newUserCompany = models.User_Company.build(permissions)
    await newUserCompany.save()
}

module.exports = createCompany