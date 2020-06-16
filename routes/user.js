const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

const userController = new UserController()

router.get('/register', userController.getRegister)
router.post('/register', userController.postRegister)
router.get('/login', userController.getLogin)
router.post('/login', userController.postLogin)
router.get('/logout', userController.getLogout)

module.exports = router