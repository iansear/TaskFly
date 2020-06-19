const bcrypt = require('bcrypt')
const createCompany = require('../database/createcompany')
const getUserProfile = require('../database/getuserprofile')

class UserController {

    getRegister(req, res) {
        res.render('register')
    }

    async postRegister(req, res) {
        if(req.body.password1 == req.body.password2) {
            const hashword = await bcrypt.hash(req.body.password2, 13)
            const user = {
                username: req.body.username,
                password: hashword,
                alias: req.body.alias,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address
            }
            const company = {
                name: req.body.companyName,
                email: req.body.companyEmail,
                phone: req.body.companyPhone
            }
            const permissions = {
                isdelivery: true,
                isorders: true,
                isdispatcher: true
            }
            try {
                await createCompany(user, company, permissions)
            } catch(error) {
                res.render('register', {message: 'Username already exists.'})
            }
            res.redirect('/user/login')
        } else {
            res.render('register', {message: 'Passwords don\'t match.'})
        }
    }

    getLogin(req, res) {
        res.render('login')
    }

    async postLogin(req, res) {
        const username = req.body.username
        const password = req.body.password
        const user = await getUserProfile(username)
        if(user) {
            const isValid = await bcrypt.compare(password, user.password)
            if(isValid) {
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    alias: user.alias,
                    email: user.email,
                    phone: user.phone,
                    address: user.address
                }
                req.session.companies = user.companies.map((company) => {
                    return {
                        id: company.id,
                        name: company.name,
                        email: company.email,
                        emailpassword: company.emailpassword,
                        emailservice: company.emailservice,
                        useemail: company.useemail,
                        phone: company.phone,
                        usephone: company.usephone,
                        isdelivery: company.usercompanies.isdelivery,
                        isorders: company.usercompanies.isorders,
                        isdispatcher: company.usercompanies.isdispatcher
                    }
                })
                res.redirect('/home')
            } else {
                res.render('login', {message: 'Incorrect Username or Password.'})
            }
        } else {
            res.render('login', {message: 'Incorrect Username or Password.'})
        }
    }

    getLogout(req, res) {
        req.session.destroy()
        res.redirect('/')
    }
}

module.exports = UserController