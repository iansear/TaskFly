const express = require('express')
const getOrders = require('../database/getorders')
const getManifest = require('../database/getmanifest')
const getHistory = require('../database/gethistory')
const getRoster = require('../database/getroster')
const createOrder = require('../database/createorder')
const updateOrder = require('../database/updateorder')
const router = express.Router()

let company = {}
let role = {}  
let roster = []
let orders = []

router.post('/neworder', async (req, res) => {
    const order = {
        companyid: req.body.companyid,
        description: req.body.description,
        instructions: req.body.instructions,
        status: "UNASSIGNED"
    }
    await createOrder(order)
    res.redirect(`/order/${role.role}/${company.id}`)
})

router.post('/updateorder', async (req, res) => {
    const orderid = req.body.orderid
    const order = {
        description: req.body.description,
        instructions: req.body.instructions,
        notes: req.body.notes,
        pod: req.body.pod
    }
    await updateOrder(orderid, order)
    res.redirect(`/order/${role.role}/${company.id}`)
})

router.post('/updateorderstatus', async (req, res) => {
    const orderid = req.body.orderid
    let status = 'UNKNOWN'
    if(req.body.status == 'PENDING') {
        status = 'ACKNOWLEDGED'
    } else if(req.body.status == 'ACKNOWLEDGED') {
        status = 'PICKED UP'
    } else if(req.body.status == 'PICKED UP') {
        status = 'DELIVERED'
    }
    const order = {
        pod: req.body.pod,
        status: status
    }
    await updateOrder(orderid, order)
    res.redirect(`/order/${role.role}/${company.id}`)
})

router.post('/assignorder', async (req, res) => {
    const orderid = req.body.orderid
    const order = {
        userid: req.body.userid,
        status: 'PENDING'
    }
    await updateOrder(orderid, order)
    res.redirect(`/order/${role.role}/${company.id}`)
})

router.post('/unassignorder', async (req, res) => {
    const orderid = req.body.orderid
    const order = {
        userid: null,
        status: 'UNASSIGNED'
    }
    await updateOrder(orderid, order)
    res.redirect(`/order/${role.role}/${company.id}`)
})

router.post('/cancelorder', async (req, res) => {
    const orderid = req.body.orderid
    const order = {
        userid: null,
        status: 'CANCELLED'
    }
    await updateOrder(orderid, order)
    res.redirect(`/order/${role.role}/${company.id}`)
})

router.get('/orderinfo/:orderid', (req, res) => {
    let deliveryvalues = {
        button: '',
        pod: false
    }
    const orderid = req.params.orderid
    const order = orders.find((order) => order.id == orderid)
    if(order) {
        if(role.delivery) {
            if(order.status == 'PENDING') {
                deliveryvalues.button = 'ACKNOWLEDGE'
            } else if(order.status == 'ACKNOWLEDGED') {
                deliveryvalues.button = 'PICK UP'
            } else if(order.status == 'PICKED UP') {
                deliveryvalues.button = 'DELIVER'
                deliveryvalues.pod = true
            }
        } 
        const details = {
            id: order.id,
            companyid: order.companyid,
            description: order.description,
            instructions: order.instructions,
            notes: order.notes,
            pod: order.pod,
            status: order.status,
            assigned: order.user ? order.user.alias : null,
            roster: roster,
            role: role,
            deliveryvalues: deliveryvalues
        }
        res.render('orderinfo', details)
    } else {
        redirect('/home')
    }
})

router.get('/delivery/manifest', async (req, res) => {
    orders = await getManifest(req.session.user.id)
    company.id = 'manifest'
    role = {
        role: 'delivery',
        dispatch: false,
        order: false,
        delivery: true
    }
    res.render('order', {company: company, orders: orders, role: role})
})

router.get('/delivery/history', async (req, res) => {
    orders = await getHistory(req.session.user.id)
    company.id = 'history'
    role = {
        role: 'delivery',
        dispatch: false,
        order: false,
        delivery: false
    }
    res.render('order', {company: company, orders: orders, role: role})
})

router.get('/:role/:companyid', async (req, res) => {
    company = req.session.companies.find((company) => company.id == req.params.companyid)
    if(company) {
        if(req.params.role == 'dispatch' && company.isdispatcher) {
            orders = await getOrders(company.id)
            roster = await getRoster(company.id)
            roster = roster.map(deliv => deliv.dataValues)
            role = {
                role: 'dispatch',
                dispatch: true,
                order: false,
                delivery: false
            }
            res.render('order', {company: company, orders: orders, role: role})
        } else if(req.params.role == 'orders' && company.isorders) {
            orders = await getOrders(company.id)
            role = {
                role: 'orders',
                dispatch: false,
                order: true,
                delivery: false
            }
            res.render('order', {company: company, orders: orders, role: role})
        } else {
            res.redirect('/home')
        } 
    } else {
        res.redirect('/home')
    }
})

module.exports = router