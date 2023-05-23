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



// GET ALL ITEMS getAllItems
router.get('/items', authenticateToken, async function (req, res, next) {
    try {
        const items = await itemsService.getAllItems();
        res.status(200).jsend.success({ ' result': items });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});


// GET ITEM BY ID getItemById
router.get('/id/:id', authenticateToken, jsonParser, async function (req, res, next) {
    const itemId = req.params.id;
    if (!itemId) {
        res.status(400).jsend.fail({ 'result': 'Item id is required' });
    }
    try {
        const item = await itemsService.getItemById(itemId);
        if (!item) {
            res.status(400).jsend.fail({ 'result': 'Item with given id not found' });
        }
        res.status(200).jsend.success({ 'result': item });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});





// POST CREATE ITEMS || categName, itemName, imgUrl, ItemPrice, ItemSku, stockQuantity
router.post('/item', authenticateToken, jsonParser, async function (req, res, next) {
    // const { category, item_name, img_url, price, sku, stock_quantity } = req.body
    const { itemName, imgUrl, itemPrice, itemSku, stockQuantity, itemCategoryId } = req.body
    const bodyarray = []
    // if (!category) bodyarray.push('category')
    if (!itemName) bodyarray.push('itemName')
    if (!imgUrl) bodyarray.push('imgUrl')
    if (!itemPrice) bodyarray.push('itemPrice')
    if (!itemSku) bodyarray.push('itemSku')
    if (!stockQuantity) bodyarray.push('stockQuantity')
    if (!itemCategoryId) bodyarray.push('itemCategoryId')

    // if (!img_url) bodyarray.push('img_url')
    // if (!price) bodyarray.push('price')
    // if (!sku) bodyarray.push('sku')
    // if (!stock_quantity) bodyarray.push('stock_quantity')
    // if (!CategoryId) bodyarray.push('CategoryId')
    if (bodyarray.length > 0) {
        // Create an error message with a list of missing fields
        const errorMessage = `Missing required ${bodyarray.join(', ')} fields`;
        const missingFieldsObject = {};
        bodyarray.forEach(field => { missingFieldsObject[field] = `You forgot to fill ${field}`; });
        // Return a Jsend fail response with an error message
        return res.status(400).jsend.fail({ "result": errorMessage, ...missingFieldsObject });
    }

    // const CategoryId = await itemsService.findOrCreateCategoryName(categoryName);


    const checkingItems = await itemsService.checkItemBySkuAndItemNameAndImgUrl(itemSku, itemName, imgUrl);
    if (checkingItems) {
        return res.status(400).jsend.fail({
            'result': `Item already exist, if you want to update use this endpoint http://127.0.0.1:3000/item/:${checkingItems.id}`,
            'sku': checkingItems.sku,
            'item_name': checkingItems.item_name,
            'img_url': checkingItems.img_url
        });
    }
    try {
        // const item = await itemsService.createItem(itemName, imgUrl, itemPrice, itemSku, stockQuantity, itemCategoryId);
        // const item = await itemsService.createItem(itemName, imgUrl, itemPrice, itemSku, stockQuantity, categoryId);
        const categoryId = await itemsService.findCategoryById(itemCategoryId);
        if (!categoryId) {
            return res.status(400).jsend.fail({ 'result': 'Category with given id not found' });
        }

        const item = await itemsService.createItem(itemName, itemPrice, itemSku, stockQuantity, imgUrl, categoryId);
        return res.status(201).jsend.success({ 'result': item });
    }
    catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});













// find cat by id
router.get('/category/:id', authenticateToken, jsonParser, async function (req, res, next) {
    const catId = req.params.id;
    if (!catId) {
        res.status(400).jsend.fail({ 'result': 'Category id is required' });
    }
    try {
        const cat = await itemsService.returnCategoryname(catId);
        if (!cat) {
            res.status(400).jsend.fail({ 'result': 'Category with given id not found' });
        }
        res.status(200).jsend.success({ 'result': cat });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});


// check item by sku, item_name, img_url and return sku, item_name, img_url
router.get('/checkname', authenticateToken, jsonParser, async function (req, res, next) {
    const { sku, item_name, img_url } = req.body;
    if (!sku) {
        res.status(400).jsend.fail({ 'result': 'sku is required' });
    }
    if (!item_name) {
        res.status(400).jsend.fail({ 'result': 'item_name is required' });
    }
    if (!img_url) {
        res.status(400).jsend.fail({ 'result': 'img_url is required' });
    }
    try {
        const item = await itemsService.checkItemBySkuAndItemNameAndImgUrl(sku, item_name, img_url);
        if (!item) {
            res.status(400).jsend.fail({ 'result': 'Item with given sku, item_name, img_url not found' });
        }
        res.status(200).jsend.success({ 'result': item });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});







module.exports = router;