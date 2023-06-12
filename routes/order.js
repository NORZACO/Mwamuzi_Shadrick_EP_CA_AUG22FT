const express = require('express');
var jsend = require('jsend');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const OrderService = require('../services/OrderServices');
const db = require('../models');
const orderService = new OrderService(db);
router.use(jsend.middleware);
const authenticateToken = require('../securedEndpoint');
// const checkAdminAuth = require('../checkAdminAuth');
// const jwt = require('jsonwebtoken');
require('dotenv').config();



// createOrder
router.get('/orders', authenticateToken, jsonParser, async (req, res) => {
    const jwt_user_id = req.user.userId;
    const jwt_user_role = req.user.role;
    try {
        const order = await orderService.getOrderByUser(jwt_user_role, jwt_user_id);
        return res.status(200).jsend.success({ "result": order });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});






router.post('/order/:id', authenticateToken, jsonParser, async (req, res) => {
    const jwt_user_id = req.user.userId;
    const jwt_user_role = req.user.role;
    const ItemId = req.params.id;


    const { itemQuantity } = req.body;
    const missingFiels = [];
    // if (!UserId) missingFiels.push('UserId');
    if (!ItemId) missingFiels.push('ItemId');
    if (!itemQuantity) missingFiels.push('itemQuantity');
    // if (!itemSku) missingFiels.push('itemSku');
    if (missingFiels.length) {
        return res.status(400).jsend.fail({ "result": `${missingFiels.join(', ')} is required` });
    }

    // rejex all, only number
    const regexNumber = /^[0-9]*$/;
    if (!regexNumber.test(itemQuantity)) {
        return res.status(400).jsend.fail({ "result": "itemQuantity must be a number" });
    }
    // itemid
    const regexItemId = /^[0-9]*$/;
    if (!regexItemId.test(ItemId)) {
        return res.status(400).jsend.fail({ "result": "ItemId must be a number" });
    }


    try {
        // calculate the stock
        // const calculate_stock = itemreTurnStock - itemQuantity;
        // create cart  ItemId, itemQuantity, itemSku 
        const NewOrder = await orderService.addOrderToOrderitems(jwt_user_role, jwt_user_id, ItemId, itemQuantity);

        return res.status(200).jsend.success({ "result": NewOrder });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});






// UPDATE update-order/:ItemId
router.put('/order/:id', authenticateToken, jsonParser, async (req, res) => {
    const jwt_user_id = req.user.userId;
    const jwt_user_role = req.user.role;
    const OrderId = req.params.id;

    const { status  } = req.body;
    const missingFiels = [];
    if (!OrderId) missingFiels.push('OrderId');
    if (!status) missingFiels.push('status');
    if (missingFiels.length) {
        return res.status(400).jsend.fail({ "result": `${missingFiels.join(', ')} is required` });
    }
    // itemid
    const regexItemId = /^[0-9]*$/;
    if (!regexItemId.test(OrderId)) {
        return res.status(400).jsend.fail({ "result": "ItemId must be a number" });
    }


    try {
        const updateOrder = await orderService.updateOrderItem(jwt_user_role, jwt_user_id, OrderId, status);
        return res.status(200).jsend.success({ "result": updateOrder });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});








































// exoprt
module.exports = router;