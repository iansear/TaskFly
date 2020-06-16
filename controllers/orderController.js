const createOrder = require('../database/createorder')
const updateOrder = require('../database/updateorder')
const getManifest = require('../database/getmanifest')
const getHistory = require('../database/gethistory')
const getOrders = require('../database/getorders')
const getRoster = require('../database/getroster')

class OrderController {

    constructor() {
        this.company = {}
        this.role = {}  
        this.roster = []
        this.orders = []
        this.assigned = []
        this.unassigned = []
        this.postNewOrder = this.postNewOrder.bind(this)
        this.postUpdateOrder = this.postUpdateOrder.bind(this)
        this.postUpdateOrderStatus = this.postUpdateOrderStatus.bind(this)
        this.postAssignOrder = this.postAssignOrder.bind(this)
        this.postUnassignOrder = this.postUnassignOrder.bind(this)
        this.postCancelOrder = this.postCancelOrder.bind(this)
        this.getOrderInfo = this.getOrderInfo.bind(this)
        this.getDeliveryManifest = this.getDeliveryManifest.bind(this)
        this.getDeliveryHistory = this.getDeliveryHistory.bind(this)
        this.getCompanyOrders = this.getCompanyOrders.bind(this)
    }

    async postNewOrder(req, res) {
        const order = {
            companyid: req.body.companyid,
            description: req.body.description,
            instructions: req.body.instructions,
            status: "UNASSIGNED"
        }
        await createOrder(order)
        res.redirect(`/order/${this.role.role}/${this.company.id}`)
    }

    async postUpdateOrder(req, res) {
        const orderid = req.body.orderid
        const order = {
            description: req.body.description,
            instructions: req.body.instructions,
            notes: req.body.notes,
            pod: req.body.pod
        }
        await updateOrder(orderid, order)
        res.redirect(`/order/${this.role.role}/${this.company.id}`)
    }

    async postUpdateOrderStatus(req, res) {
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
        res.redirect(`/order/${this.role.role}/${this.company.id}`)
    }

    async postAssignOrder(req, res) {
        const orderid = req.body.orderid
        if(req.body.userid != 'NONE') {
            const order = {
                userid: req.body.userid,
                status: 'PENDING'
            }
            await updateOrder(orderid, order)
            res.redirect(`/order/${this.role.role}/${this.company.id}`)
        } else {
            res.redirect(`/order/orderinfo/${orderid}`)
        }
    }

    async postUnassignOrder(req, res) {
        const orderid = req.body.orderid
        const order = {
            userid: null,
            status: 'UNASSIGNED'
        }
        await updateOrder(orderid, order)
        res.redirect(`/order/${this.role.role}/${this.company.id}`)
    }

    async postCancelOrder(req, res) {
        const orderid = req.body.orderid
        const order = {
            userid: null,
            status: 'CANCELLED'
        }
        await updateOrder(orderid, order)
        res.redirect(`/order/${this.role.role}/${this.company.id}`)
    }

    postOrderInfo(req, res) {
        res.redirect(`/order/orderinfo/${req.body.orderid}`)
    }

    getOrderInfo(req, res) {
        let deliveryvalues = {
            button: '',
            pod: false
        }
        const order = this.orders.find((order) => order.id == req.params.orderid)
        if(order) {
            if(this.role.delivery) {
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
                roster: this.roster,
                role: this.role,
                deliveryvalues: deliveryvalues
            }
            res.render('orderinfo', details)
        } else {
            res.render('order', {company: this.company, orders: this.orders, assigned: this.assigned, unassigned: this.unassigned, role: this.role, roster: this.roster, searchmessage: 'No order found.'})
        }
    }

    async getDeliveryManifest(req, res) {
        this.orders = await getManifest(req.session.user.id)
        this.company.id = 'manifest'
        this.role = {
            role: 'delivery',
            dispatch: false,
            order: false,
            delivery: true,
            history: false
        }
        res.render('order', {company: this.company, orders: this.orders, role: this.role})
    }

    async getDeliveryHistory(req, res) {
        this.orders = await getHistory(req.session.user.id)
        this.company.id = 'history'
        this.role = {
            role: 'delivery',
            dispatch: false,
            order: false,
            delivery: false,
            history: true
        }
        res.render('order', {company: this.company, orders: this.orders, role: this.role})
    }

    async getCompanyOrders(req, res) {
        this.company = req.session.companies.find((company) => company.id == req.params.companyid)
        if(this.company) {
            this.orders = await getOrders(this.company.id)
            this.unassigned = this.orders.filter(order => order.status == 'UNASSIGNED')
            this.assigned = this.orders.filter(order => order.status != 'UNASSIGNED')
            this.assigned.sort((a, b) => {
                if ( a.alias < b.alias ) {
                    return -1;
                }
                if ( a.alias > b.alias ) {
                    return 1;
                }
                return 0;
            })
            if(req.params.role == 'dispatch' && this.company.isdispatcher) {
                this.roster = await getRoster(this.company.id)
                this.roster = this.roster.map(deliv => deliv.dataValues)
                this.role = {
                    role: 'dispatch',
                    dispatch: true,
                    order: false,
                    delivery: false,
                    history: false
                }
                res.render('order', {company: this.company, orders: this.orders, assigned: this.assigned, unassigned: this.unassigned, role: this.role, roster: this.roster})
            } else if(req.params.role == 'orders' && this.company.isorders) {
                this.role = {
                    role: 'orders',
                    dispatch: false,
                    order: true,
                    delivery: false,
                    history: false
                }
                res.render('order', {company: this.company, orders: this.orders, role: this.role})
            } else {
                res.redirect('/home')
            } 
        } else {
            res.redirect('/home')
        }
    }
}

module.exports = OrderController