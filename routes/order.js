const express = require('express');
var jsend = require('jsend');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const OrderService = require('../services/CartServices');
const db = require('../models');
const orderService = new OrderService(db);
router.use(jsend.middleware);
const authenticateToken = require('../securedEndpoint');
const jwt = require('jsonwebtoken');
require('dotenv').config();










// createOrder
router.post('/create-order', authenticateToken, jsonParser, async (req, res) => {
    const UserId = req.user.userId;
    const missingFiels = [];
    if (!UserId) missingFiels.push('UserId');
    if (missingFiels.length) {
        return res.status(400).jsend.fail({ "result": "missing fields", "fields": missingFiels });
    }
    try {
        const order = await orderService.createOrder(UserId);
        return res.status(200).jsend.success({ "result": order });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});















































// exoprt
module.exports = router;