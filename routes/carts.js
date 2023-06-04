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



// GET MY CART BY ID
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
router.post('/add-to-cart', authenticateToken, jsonParser, async (req, res) => {
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
        const NewCart = await cartServices.addItemToCart_and_ToCartItem_ManagedTransactions(UserId, ItemId, itemQuantity, itemSku);

        return res.status(200).jsend.success({ "result": NewCart });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});



//UPDATE  updateItemInCart_and_ToCartItem_ManagedTransactions
router.put('/update-cart/:ItemId', authenticateToken, jsonParser, async (req, res) => {
    const UserId = req.user.userId;
    const ItemId = req.params.ItemId;
    const { itemQuantity, itemSku } = req.body;
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
        const NewCart = await cartServices.updateItemInCart_and_ToCartItem_ManagedTransactions(UserId, ItemId, itemQuantity, itemSku);
        console.log(NewCart);
        return res.status(200).jsend.success({ "result": NewCart });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});







/*
// createCartAndCartitem JWTuserId, ItemId, ItemQuantity
router.post('/add-to-cartX', authenticateToken, jsonParser, async (req, res) => {
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
    // const cart = await cartServices.getCartByUserId(UserId);
    // if (!cart) {
    //     return res.status(400).jsend.fail({ "result": "Cart with given id not found" });
    // }

    // // reTurnStock
    // const itemreTurnStock = await cartServices.reTurnStock(ItemId);
    // if (!itemreTurnStock) {
    //     return res.status(400).jsend.fail({ "result": "Item with given id not found" });
    // }
    // // if (itemQuantity > itemreTurnStock) {
    // //     return res.status(400).jsend.fail({ "result": "ItemQuantity must be less than stock" });
    // // }


    try {
        // calculate the stock
        // const calculate_stock = itemreTurnStock - itemQuantity;
        // create cart
        const NewCart = await cartServices.createCart(UserId, itemQuantity, ItemId/*, calculate_stock/);

        return res.status(200).jsend.success({ "result": NewCart });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});

*/







































































// PUT /cart_item/:id   updateCartitem(cartId, item_id, quantity)
router.put('/cart_item/:id', authenticateToken, jsonParser, async (req, res) => {
    const cartId = req.params.id;
    const { item_id, quantity } = req.body;
    const missingFiels = [];
    if (!cartId) missingFiels.push('cartId');
    if (!item_id) missingFiels.push('item_id');
    if (!quantity) missingFiels.push('quantity');
    if (missingFiels.length) {
        return res.status(400).jsend.fail({ "result": `${missingFiels.join(', ')} is required` });
    }
    // rejex all, only number
    const regexNumber = /^[0-9]*$/;
    if (!regexNumber.test(quantity)) {
        return res.status(400).jsend.fail({ "result": "quantity must be a number" });
    }
    // item_id
    const regexItemId = /^[0-9]*$/;
    if (!regexItemId.test(item_id)) {
        return res.status(400).jsend.fail({ "result": "item_id must be a number" });
    }
    // cartId
    const regexCartId = /^[0-9]*$/;
    if (!regexCartId.test(cartId)) {
        return res.status(400).jsend.fail({ "result": "cartId must be a number" });
    }

    try {
        const updateCartItems_id = await cartServices.updateCartitemQuantity(cartId, item_id, quantity)
        return res.status(200).jsend.success({ "result": updateCartItems_id });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});




// export
module.exports = router;