const express = require('express')
const router = express.Router()
const ManagementController = require('../controllers/managementController')

const managementController = new ManagementController()

router.post('/newemployee', managementController.postNewEmployee)
router.post('/addemployee', managementController.postAddEmployee)
router.post('/updateemployee', managementController.postUpdateEmployee)
router.post('/updatecompany', managementController.postUpdateCompany)
router.post('/deactivateemployee', managementController.postDeactivateEmployee)
router.get('/employeeinfo/:userid', managementController.getEmployeeInfo)
router.get('/employee/:companyid', managementController.getCompanyEmployees)
router.get('/company/:companyid', managementController.getCompanyInfo)

module.exports = router