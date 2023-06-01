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
const jwt = require('jsonwebtoken');
require('dotenv').config();










// createOrder
router.get('/get_order', authenticateToken, jsonParser, async (req, res) => {
    const UserId = req.user.userId;
    if (!UserId) {
        return res.status(401).jsend.fail({ "result": "missing fields" });
    }
    try {
        const order = await orderService.getCartByUserId(UserId);
        return res.status(200).jsend.success({ "result": order });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});















































// exoprt
module.exports = router;