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




// addOrderToOrderitems






// createOrder
router.get('/get_order', authenticateToken, jsonParser, async (req, res) => {
    const UserId = req.user.userId;
    if (!UserId) {
        return res.status(401).jsend.fail({ "result": "missing fields" });
    }
    try {
        const order = await orderService.getOrderByUser(UserId);
        return res.status(200).jsend.success({ "result": order });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});






router.post('/add-to-order', authenticateToken, jsonParser, async (req, res) => {
    const UserId = req.user.userId;
    const { ItemId, itemQuantity, itemSku } = req.body;
    const missingFiels = [];
    if (!UserId) missingFiels.push('UserId');
    if (!ItemId) missingFiels.push('ItemId');
    if (!itemQuantity) missingFiels.push('itemQuantity');
    if (!itemSku) missingFiels.push('itemSku');
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
    // UserId
    const regexUserId = /^[0-9]*$/;
    if (!regexUserId.test(UserId)) {
        return res.status(400).jsend.fail({ "result": "UserId must be a number" });
    }

    try {
        // calculate the stock
        // const calculate_stock = itemreTurnStock - itemQuantity;
        // create cart  ItemId, itemQuantity, itemSku 
        const NewOrder = await orderService.addOrderToOrderitems(UserId, ItemId, itemQuantity, itemSku);

        return res.status(200).jsend.success({ "result": NewOrder });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});















































// exoprt
module.exports = router;