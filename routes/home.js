const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const user = req.session.user
    const companies = req.session.companies
    res.render('home', {user: user, companies: companies})
})

module.exports = router