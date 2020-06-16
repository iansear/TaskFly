const express = require('express')
const router = express.Router()
const MainController = require('../controllers/mainController')

const mainController = new MainController()

router.get('/', mainController.main)

module.exports = router