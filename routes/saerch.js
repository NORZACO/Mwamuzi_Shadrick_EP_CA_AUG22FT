const express = require('express');
var jsend = require('jsend');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const SearchService = require('../services/SearchService');
const db = require('../models');
const searchService = new SearchService(db);
router.use(jsend.middleware);
const authenticateToken = require('../securedEndpoint');
// const checkAdminAuth = require('../checkAdminAuth');
// const jwt = require('jsonwebtoken');
require('dotenv').config();





// searchItemName
router.post('/search', jsonParser, async (req, res) => {

    const { Search } = req.body
    try {
        const order = await searchService.searchItemName(Search);
        return res.status(200).jsend.success({ "result": order });
    } catch (error) {
        return res.status(500).jsend.fail({ "result": error.message });
    }
});

































































// export
module.exports = router;
