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
const { GEOMETRY } = require('sequelize');
const { get } = require('../app');



// GET ALL ITEMS getAllItems
router.get('/all', authenticateToken, async function (req, res, next) {
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
router.post('/create1', authenticateToken, jsonParser, async function (req, res, next) {
    const { category, item_name, img_url, price, sku, stock_quantity } = req.body
    const bodyarray = []
    try {
        if (!category) bodyarray.push('categName')
        if (!item_name) bodyarray.push('itemName')
        if (!img_url) bodyarray.push('imgUrl')
        if (!price) bodyarray.push('ItemPrice')
        if (!sku) bodyarray.push('ItemSku')
        if (!stock_quantity) bodyarray.push('stockQuantity')
        if (bodyarray.length > 0) {
            return res.status(400).jsend.fail({ 'result': `${bodyarray} are required` });
        }

        const item = await itemsService.createCategoryNameIf_idNotExist(
            item_name,
            img_url,
            price,
            sku,
            stock_quantity
        );
        res.status(201).jsend.success({ 'result': item });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});




/*

router.post('/create', async (req, res) => {
    try {
        const item = await itemsService.createItemWithCategory(req.body);
        res.status(200).send(item);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

POST a new item
router.post('/create', jsonParser, async (req, res, next) => {
    try {
        const { categName, itemName, price, sku, stockQuantity, imgUrl } = req.body;
        const item = await itemsService.createCategoryNameIf_idNotExist(
            categName,
            itemName,
            price,
            sku,
            stockQuantity,
            imgUrl
        );
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
*/


// 








module.exports = router;