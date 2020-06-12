const express = require('express')
const bcrypt = require('bcrypt')
const getEmployees = require('../database/getemployees')
const getUserProfile = require('../database/getuserprofile')
const createUser = require('../database/createuser')
const updateUser = require('../database/updateuser')
const deactivateUser = require('../database/deactivateuser')
const addUser = require('../database/adduser')
const router = express.Router()

let company = {}
let employees = []

function getDetails(employee) {
    const usercompany = employee.companies.find(usercompany => usercompany.id == company.id)
    const details = {
        id: employee.id,
        username: employee.username,
        alias: employee.alias,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        companyid: usercompany.id,
        usercompanyid: usercompany.usercompanies.id,
        isdispatcher: usercompany.usercompanies.isdispatcher,
        isorders: usercompany.usercompanies.isorders,
        isdelivery: usercompany.usercompanies.isdelivery
    }
    return details
}

router.post('/newemployee', async (req, res) => {
    const hashword = await bcrypt.hash(req.body.password, 13)
    const user = {
        username: req.body.username,
        password: hashword,
        alias: req.body.alias,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    }
    const permissions = {
        companyid: req.body.companyid,
        isdelivery: req.body.isdelivery ? true : false,
        isorders: req.body.isorders ? true : false,
        isdispatcher: req.body.isdispatcher ? true : false
    }
    try {
        await createUser(user, permissions)
    } catch(error) {
        res.render('management', {company: company, employees: employees, newmessage: 'Username already exists.'})
    }
    res.redirect(`/management/${company.id}`)
})

router.post('/addemployee', async (req, res) => {
    const username = req.body.username
    const user = await getUserProfile(username)
    if(user) {
        const permissions = {
            userid: user.id,
            companyid: req.body.companyid,
            isdelivery: req.body.isdelivery ? true : false,
            isorders: req.body.isorders ? true : false,
            isdispatcher: req.body.isdispatcher ? true : false
        }
        await addUser(permissions)
        res.redirect(`/management/${company.id}`)
    } else {
        res.render('management', {company: company, employees: employees, addmessage: 'No user found.'})
    }
})

router.post('/updateemployee', async (req, res) => {
    const userid = req.body.id
    const usercompanyid = req.body.usercompanyid
    const user = {
        alias: req.body.alias,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    }
    const permissions = {
        isdelivery: req.body.isdelivery ? true : false,
        isorders: req.body.isorders ? true : false,
        isdispatcher: req.body.isdispatcher ? true : false
    }
    await updateUser(userid, user, usercompanyid, permissions)
    res.redirect(`/management/${company.id}`)
})

router.post('/deactivateemployee', async (req, res) => {
    const isremove = req.body.isremove ? true : false
    const usercompanyid = req.body.usercompanyid
    if(isremove) {
        await deactivateUser(usercompanyid)
    }
    res.redirect(`/management/${company.id}`)
})

router.get('/employeeinfo/:userid', (req, res) => {
    const employee = employees.find(employee => employee.id == req.params.userid)
    if(employee) {
        res.render('employeeinfo', employee)
    } else {
        res.redirect('/home')
    }
})

router.get('/:companyid', async (req, res) => {
    company = req.session.companies.find(company => company.id == req.params.companyid)
    if(company) {
        if(company.isdispatcher) {
            employees = await getEmployees(company.id)
            employees = employees.filter(employee => employee.username != req.session.user.username)
            employees = employees.map(employee => getDetails(employee))
            res.render('management', {company: company, employees: employees})
        } else {
            res.redirect('/home')
        }
    } else {
        res.redirect('/home')
    }
})

module.exports = router