const express = require('express');
var jsend = require('jsend');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const ItemsService = require('../services/ItemServices');
const db = require('../models');
const itemsService = new ItemsService(db);
router.use(jsend.middleware);
const authenticateToken = require('../securedEndpoint');

require('dotenv').config();



// GET ALL ITEMS getAllItems
router.get('/items', authenticateToken, async function (req, res, next) {
    console.log('req', req.user);

    const jwt_user_id = req.user.userId;
    const jwt_user_role = req.user.role;

    try {
        const items = await itemsService.getAllItemsByUser(jwt_user_role, jwt_user_id);
        res.status(200).jsend.success({ ' result': items });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});



// GET ITEM BY ID getItemById
router.get('/item/:itemId', authenticateToken, jsonParser, async function (req, res, next) {
    const itemId = req.params.itemId;
    console.log('req', req.user);
    const user_id = req.user.userId;
    const role = req.user.role;
    try {
        const item = await itemsService.getItemByPK(itemId, role, user_id);
        res.status(200).jsend.success({ ' result': item });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});






// POST CREATE ITEMS || categName, itemName, imgUrl, ItemPrice, ItemSku, stockQuantity
router.post('/item', authenticateToken, jsonParser, async function (req, res, next) {
    // const { category, item_name, img_url, price, sku, stock_quantity } = req.body
    const { itemName, imgUrl, itemPrice, itemSku, stockQuantity, itemCategoryId } = req.body
    const { role, userId } = req.user
    const bodyarray = []
    // if (!category) bodyarray.push('category')
    if (!itemName) bodyarray.push('itemName')
    if (!imgUrl) bodyarray.push('imgUrl')
    if (!itemPrice) bodyarray.push('itemPrice')
    if (!itemSku) bodyarray.push('itemSku')
    if (!stockQuantity) bodyarray.push('stockQuantity')
    if (!itemCategoryId) bodyarray.push('itemCategoryId')

    if (bodyarray.length > 0) {
        // Create an error message with a list of missing fields
        const errorMessage = `Missing required ${bodyarray.join(', ')} fields`;
        const missingFieldsObject = {};
        bodyarray.forEach(field => { missingFieldsObject[field] = `You forgot to fill ${field}`; });
        // Return a Jsend fail response with an error message
        return res.status(400).jsend.fail({ "result": errorMessage, ...missingFieldsObject });
    }

    try {

        const item = await itemsService.createItem(
            itemName, itemPrice, itemSku, stockQuantity, imgUrl, itemCategoryId, role, userId
        );
        return res.status(201).jsend.success({ 'result': item });
    }
    catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});





// UPDATE
router.put('/item/:itemId', authenticateToken, jsonParser, async function (req, res, next) {
    const itemId = req.params.itemId;

    console.log('req', req.user);
    const user_id = req.user.userId;
    const role = req.user.role;

    const { itemName, imgUrl, itemPrice, itemSku, stockQuantity, itemCategoryId } = req.body
    const bodyarray = []
    if (!itemName) bodyarray.push('itemName')
    if (!imgUrl) bodyarray.push('imgUrl')
    if (!itemPrice) bodyarray.push('itemPrice')
    if (!itemSku) bodyarray.push('itemSku')
    if (!stockQuantity) bodyarray.push('stockQuantity')
    if (!itemCategoryId) bodyarray.push('itemCategoryId')
    if (bodyarray.length > 0) {
        // Create an error message with a list of missing fields
        const errorMessage = `Missing required ${bodyarray.join(', ')} fields`;
        const missingFieldsObject = {};
        bodyarray.forEach(field => { missingFieldsObject[field] = `You forgot to fill ${field}`; });
        // Return a Jsend fail response with an error message
        return res.status(400).jsend.fail({ "result": errorMessage, ...missingFieldsObject });
    }

    // UPDATE
    try {
        const item = await itemsService.updateItem(itemId, itemName, itemPrice, itemSku, stockQuantity, imgUrl, itemCategoryId,
            role, user_id);
        return res.status(200).jsend.success({ 'result': item });
    }
    catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});




// deleteItem
router.delete('/item/:itemId', authenticateToken, jsonParser, async function (req, res, next) {
    const itemId = req.params.itemId;
    console.log('req', req.user);
    const user_id = req.user.userId;
    const role = req.user.role;

    try {
        const item = await itemsService.deleteItem(itemId, role, user_id);
        if (!item) {
            return res.status(400).jsend.fail({ 'result': 'Item with given id not found' });
        }

        return res.status(200).jsend.success({ 'result': item });
    }
    catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});


/*

        //     // Check item by  item_name, price, sku, stock_quantity, img_url, CategoryId
        const checkingItems = await itemsService.checkItemByAllAttributes(itemId, itemName, itemPrice, itemSku, stockQuantity, imgUrl, itemCategoryId);
        if (checkingItems && checkingItems.stock_quantity === !parseInt(stockQuantity)) {
            console.log(parseInt('step 1', checkingItems.stock_quantity) === parseInt(stockQuantity));
            return res.status(400).jsend.fail({
                'result': `Item already exist`,
                'sku': checkingItems.sku,
                'item_name': checkingItems.item_name,
                'img_url': checkingItems.img_url,
                'price': checkingItems.price,
                'stock_quantity': checkingItems.stock_quantity,
                'CategoryId': checkingItems.CategoryId,
                'item_id': checkingItems.item_id
            });
        } else if (checkingItems.id === itemId && checkingItems.stock_quantity === parseInt(stockQuantity)) {
            console.log(parseInt('step 2', checkingItems.stock_quantity) === parseInt(stockQuantity));
            // ONLY ADD THE STOCK
            await itemsService.updateItem(checkingItems.id,
                checkingItems.item_name,
                checkingItems.price,
                checkingItems.sku,
                checkingItems.stock_quantity + parseInt(stockQuantity),
                checkingItems.img_url,
                checkingItems.CategoryId);
            // UPDATE ITEM CATEGORY
        } else if (checkingItems.id === itemId && checkingItems.stock_quantity !== parseInt(stockQuantity)) {
            console.log(parseInt('step 3', checkingItems.stock_quantity) === parseInt(stockQuantity));
            // UPDATE ITEM CATEGORY
            await itemsService.updateItem(checkingItems.id,
                checkingItems.item_name,
                checkingItems.price,
                checkingItems.sku,
                parseInt(stockQuantity),
                checkingItems.img_url,
                checkingItems.CategoryId);
        } else if (checkingItems.id !== itemId && checkingItems.stock_quantity === parseInt(stockQuantity)) {
            console.log(parseInt('step 4', checkingItems.stock_quantity) === parseInt(stockQuantity));
            return res.status(400).jsend.fail({
                'result': `Item already exist`,
                'sku': checkingItems.sku,
                'item_name': checkingItems.item_name,
                'img_url': checkingItems.img_url,
                'price': checkingItems.price,
                'stock_quantity': checkingItems.stock_quantity,
                'CategoryId': checkingItems.CategoryId,
                'item_id': checkingItems.item_id
            });
        } else if (checkingItems.id !== itemId && checkingItems.stock_quantity !== parseInt(stockQuantity)) {
            console.log(parseInt('step 5', checkingItems.stock_quantity) === parseInt(stockQuantity));
            return res.status(200).jsend.success({
                'result': `Item already exist, if you want to update use this endpoint http://localhost:3000/api/v1/item/:itemId`,
                'sku': checkingItems.sku,
                'item_name': checkingItems.item_name,
                'img_url': checkingItems.img_url,
                'price': checkingItems.price,
                'stock_quantity': checkingItems.stock_quantity,
                'CategoryId': checkingItems.CategoryId,
                'id': checkingItems.id
            });
        }

        return res.status(200).jsend.success({ 'result': item });
    }
    catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});

*/





// find cat by id
// router.get('/category/:id', authenticateToken, jsonParser, async function (req, res, next) {
//     const catId = req.params.id;
//     if (!catId) {
//         res.status(400).jsend.fail({ 'result': 'Category id is required' });
//     }
//     try {
//         const cat = await itemsService.returnCategoryname(catId);
//         if (!cat) {
//             res.status(400).jsend.fail({ 'result': 'Category with given id not found' });
//         }
//         res.status(200).jsend.success({ 'result': cat });
//     } catch (error) {
//         res.status(500).jsend.fail({ 'result': error.message });
//     }
// });


// check item by sku, item_name, img_url and return sku, item_name, img_url
// router.get('/checkname', authenticateToken, jsonParser, async function (req, res, next) {
//     const { sku, item_name, img_url } = req.body;
//     if (!sku) {
//         res.status(400).jsend.fail({ 'result': 'sku is required' });
//     }
//     if (!item_name) {
//         res.status(400).jsend.fail({ 'result': 'item_name is required' });
//     }
//     if (!img_url) {
//         res.status(400).jsend.fail({ 'result': 'img_url is required' });
//     }
//     try {
//         const item = await itemsService.checkItemBySkuAndItemNameAndImgUrl(sku, item_name, img_url);
//         if (!item) {
//             res.status(400).jsend.fail({ 'result': 'Item with given sku, item_name, img_url not found' });
//         }
//         res.status(200).jsend.success({ 'result': item });
//     } catch (error) {
//         res.status(500).jsend.fail({ 'result': error.message });
//     }
// });







module.exports = router;