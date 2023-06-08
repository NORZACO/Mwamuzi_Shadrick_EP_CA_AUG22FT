const express = require('express');
var jsend = require('jsend');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const UtilityServices = require('../Utility/prepopulation');
const db = require('../models');
const utilityServices = new UtilityServices(db);
router.use(jsend.middleware);
const  authenticateToken  = require('../securedEndpoint');



// Utilityprepopulation
router.post('/setup', async function (req, res, next) {
    // const { role } = req.user;
    // const role_name = await categoryService.getRoleName(role);
    // if (role_name !== 'Admin') {
    //     return res.status(401).jsend.fail({ 'result': `Unauthorized  page, only ${role_name} are allowed here` });
    // }
    try {
        await utilityServices.Utilityprepopulation();
        const utility = await utilityServices.updateItem();
        res.status(200).jsend.success({ 'result': utility });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
}
);






// export
module.exports = router;