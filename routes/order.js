const express = require('express')
const router = express.Router()

router.get('/placeorder/:companyid', (req, res) => {
    res.render('placeorder')
})

module.exports = router