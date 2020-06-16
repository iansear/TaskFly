const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/orderController')

const orderController = new OrderController()

router.post('/neworder', orderController.postNewOrder)
router.post('/updateorder', orderController.postUpdateOrder)
router.post('/updateorderstatus', orderController.postUpdateOrderStatus)
router.post('/assignorder', orderController.postAssignOrder)
router.post('/unassignorder', orderController.postUnassignOrder)
router.post('/cancelorder', orderController.postCancelOrder)
router.post('/orderinfo', orderController.postOrderInfo)
router.get('/orderinfo/:orderid', orderController.getOrderInfo)
router.get('/delivery/manifest', orderController.getDeliveryManifest)
router.get('/delivery/history', orderController.getDeliveryHistory)
router.get('/:role/:companyid', orderController.getCompanyOrders)

module.exports = router