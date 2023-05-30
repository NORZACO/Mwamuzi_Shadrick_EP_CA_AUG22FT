const express = require('express');
var jsend = require('jsend');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const CartServices = require('../services/CartServices');
const db = require('../models');
const cartServices = new CartServices(db);
router.use(jsend.middleware);
const authenticateToken = require('../securedEndpoint');
const jwt = require('jsonwebtoken');
require('dotenv').config();





// GET ALL CARTS
router.get('/allcarts', authenticateToken, async (req, res) => {
    try {
        const carts = await cartServices.getAllCarts();
        res.jsend.success({
            "result": carts
        });
    } catch (error) {
        res.jsend.fail({ "result": error.message });
    }
});



// GET CART BY ID
router.get('/cart', authenticateToken, jsonParser, async (req, res) => {
    const cartId = req.user.userId;
    if (!cartId) {
        return res.status(400).jsend.fail({ "result": "cartId is required" });
    }
    try {
        const cart = await cartServices.getCartByUserId(cartId);
        if (!cart) {
            return res.status(400).jsend.fail({ "result": "Cart with given id not found" });
        }
        return res.status(200).jsend.success({ "result": cart });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});



// createCartAndCartitem JWTuserId, ItemId, ItemQuantity
router.post('/cart_item', authenticateToken, jsonParser, async (req, res) => {
    const UserId = req.user.userId;
    const { ItemId, itemQuantity } = req.body;
    const missingFiels = [];
    if (!UserId) missingFiels.push('UserId');
    if (!ItemId) missingFiels.push('ItemId');
    if (!itemQuantity) missingFiels.push('itemQuantity');
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

    // checkCartbyJWT
    const cart = await cartServices.getCartByUserId(UserId);
    if (!cart) {
        return res.status(400).jsend.fail({ "result": "Cart with given id not found" });
    }

    // reTurnStock
    const itemreTurnStock = await cartServices.reTurnStock(ItemId);
    if (!itemreTurnStock) {
        return res.status(400).jsend.fail({ "result": "Item with given id not found" });
    }
    // if (itemQuantity > itemreTurnStock) {
    //     return res.status(400).jsend.fail({ "result": "ItemQuantity must be less than stock" });
    // }


    try {
        // calculate the stock
        const calculate_stock = itemreTurnStock - itemQuantity;
        // create cart
        const NewCart = await cartServices.createCart(UserId, itemQuantity, ItemId, calculate_stock);

        return res.status(200).jsend.success({ "result": NewCart });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});


// createOrderAndOrderItem




// export
module.exports = router;