const express = require('express');
var jsend = require('jsend');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const CategoryService = require('../services/CategotyServices');
const db = require('../models');
const categoryService = new CategoryService(db);
router.use(jsend.middleware);
const authenticateToken = require('../securedEndpoint');



// GET ALL CATEGORIES
router.get('/categories', authenticateToken, async function (req, res, next) {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).jsend.success({ ' result': categories });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});



// GET CATEGORY BY ID getCategoryById
router.get('/category/:id', authenticateToken, jsonParser, async function (req, res, next) {
    const categoryId = req.params.id;
    if (!categoryId) {
        return res.status(400).jsend.fail({ 'result': 'categoryId is required' });
    }
    try {
        const category = await categoryService.getCategoryById(categoryId);
        if (!category) {
            return res.status(400).jsend.fail({ 'result': 'Category with given id not found' });
        }
        return res.status(200).jsend.success({ 'result': category });
    } catch (error) {
        return res.status(500).jsend.fail({ 'result': error.message });
    }
});



// POST createCategory
router.post('/category', authenticateToken, jsonParser, async function (req, res, next) {
    const { name } = req.body;
    if (!name) {
        return res.status(400).jsend.fail({ 'result': 'name is required' });
    }
    try {
        const category = await categoryService.createCategory(name);
        return res.status(200).jsend.success({ 'result': category.name });
    } catch (error) {
        return res.status(500).jsend.fail({ 'result': error.message });
    }
});



// PUT updateCategory
router.put('/category/:id', authenticateToken, jsonParser, async function (req, res, next) {
    const categoryId = req.params.id;
    const { name } = req.body;
    if (!categoryId) {
        return res.status(400).jsend.fail({ 'result': 'categoryId is required' });
    }
    if (!name) {
        return res.status(400).jsend.fail({ 'result': 'name is required' });
    }

    const category = await categoryService.getCategoryName(name, categoryId);
    if (category) {
        return res.status(400).jsend.fail({ 'result': 'Category aleady exist' });
    }



    try {
        const category = await categoryService.updateCategory(categoryId, name);
        if (!category) {
            return res.status(400).jsend.fail({ 'result': 'Category with given id not found' });
        }
        return res.status(200).jsend.success({ 'result': category });
    } catch (error) {
        return res.status(500).jsend.fail({ 'result': error.message });
    }
});


// POST deleteCategory
// router.post('/category/:id', authenticateToken, jsonParser, async function (req, res, next) {
//     const categoryId = req.params.id;
//     if (!categoryId) {
//         return res.status(400).jsend.fail({ 'result': 'categoryId is required' });
//     }
//     try {
//         const category = await categoryService.deleteCategory(categoryId);
//         if (!category) {
//             return res.status(400).jsend.fail({ 'result': 'Category with given id not found' });
//         }
//         return res.status(200).jsend.success({ 'result': category });
//     } catch (error) {
//         return res.status(500).jsend.fail({ 'result': error.message });
//     }
// });



// DELETE category deleteCategory
router.delete('/category/:id', authenticateToken, jsonParser, async function (req, res, next) {
    const categoryId = req.params.id;
    if (!categoryId) {
        return res.status(400).jsend.fail({ 'result': 'categoryId is required' });
    }
    try {
        const category = await categoryService.deleteCategory(categoryId);
        if (!category) {
            return res.status(400).jsend.fail({ 'result': `Category with given ${categoryId} id not found` });
        }
        return res.status(200).jsend.success({ 'result': `Ca5tegory with the name ${category} have succefully deleted` });
    } catch (error) {
        return res.status(500).jsend.fail({ 'result': error.message });
    }
});








module.exports = router;