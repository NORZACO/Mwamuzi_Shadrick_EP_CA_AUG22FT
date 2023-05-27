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





// GET ALL CART CartServices
router.get('/allcarts', authenticateToken, async function (req, res, next) {
    try {
        const carts = await cartServices.getAllCart();
        res.status(200).jsend.success({ ' result': carts });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});


 // addItemToCart id, createdAt, updatedAt, UserId item to Cart
router.post('/cart_item', authenticateToken, jsonParser, async function (req, res, next) {
    try {
        const { quantity, CartId, ItemId } = req.body;
        const cart = await cartServices.addItemToCart(quantity, CartId, ItemId);
        res.status(200).jsend.success({ 'result': cart });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});



//CREATE CART with the loggin user userid
router.post('/cart', authenticateToken, jsonParser, async function (req, res, next) {
    try {
        const { UserId } = req.body;
        const userExist = await cartServices.findUserById(UserId);
        if (!userExist) {
            res.status(400).jsend.fail({ 'result': 'User is not found' });
        }
        // user exist in any cart
        // const cartExist = await cartServices.findCartByUserId(UserId);
        // if (cartExist) {
        //     res.status(400).jsend.fail({ 'result': 'User already has a cart' });
        // }
    
        const cart = await cartServices.createCart(UserId);
        res.status(200).jsend.success({ 'result': cart });  
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});












































// export
module.exports = router;