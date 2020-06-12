const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const user = req.session.user
    const companies = req.session.companies
    const deliverycompanies = companies.filter(company => company.isdelivery == true)
    let showmanifest = false
    if(deliverycompanies.length > 0) {
        showmanifest = true
    }
    res.render('home', {user: user, companies: companies, showmanifest: showmanifest})
})

module.exports = router