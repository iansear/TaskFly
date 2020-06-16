const bcrypt = require('bcrypt')
const createUser = require('../database/createuser')
const addUser = require('../database/adduser')
const getUserProfile = require('../database/getuserprofile')
const updateUser = require('../database/updateuser')
const deactivateUser = require('../database/deactivateuser')
const getEmployees = require('../database/getemployees')

class ManagementController {

    constructor() {
        this.company = {}
        this.employees = []
        this.getCompanyEmployees = this.getCompanyEmployees.bind(this)
        this.getEmployeeInfo = this.getEmployeeInfo.bind(this)
        this.postAddEmployee = this.postAddEmployee.bind(this)
        this.postDeactivateEmployee = this.postDeactivateEmployee.bind(this)
        this.postUpdateEmployee = this.postUpdateEmployee.bind(this)
        this.postNewEmployee = this.postNewEmployee.bind(this)
    }

    getDetails(employee) {
        const usercompany = employee.companies.find(usercompany => usercompany.id == this.company.id)
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

    async postNewEmployee(req, res) {
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
            res.render('management', {company: this.company, employees: this.employees, newmessage: 'Username already exists.'})
        }
        res.redirect(`/management/company/${this.company.id}`)
    }

    async postAddEmployee(req, res) {
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
            res.redirect(`/management/company/${this.company.id}`)
        } else {
            res.render('management', {company: this.company, employees: this.employees, addmessage: 'No user found.'})
        }
    }

    async postUpdateEmployee(req, res) {
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
        res.redirect(`/management/company/${this.company.id}`)
    }

    async postDeactivateEmployee(req, res) {
        const isremove = req.body.isremove ? true : false
        const usercompanyid = req.body.usercompanyid
        if(isremove) {
            await deactivateUser(usercompanyid)
        }
        res.redirect(`/management/company/${this.company.id}`)
    }

    getEmployeeInfo(req, res) {
        const employee = this.employees.find(employee => employee.id == req.params.userid)
        if(employee) {
            res.render('employeeinfo', employee)
        } else {
            res.redirect('/home')
        }
    }

    async getCompanyEmployees(req, res) {
        this.company = req.session.companies.find(company => company.id == req.params.companyid)
        if(this.company) {
            if(this.company.isdispatcher) {
                this.employees = await getEmployees(this.company.id)
                this.employees = this.employees.filter(employee => employee.username != req.session.user.username)
                this.employees = this.employees.map(employee => this.getDetails(employee))
                res.render('management', {company: this.company, employees: this.employees})
            } else {
                res.redirect('/home')
            }
        } else {
            res.redirect('/home')
        }
    }
}

module.exports = ManagementController