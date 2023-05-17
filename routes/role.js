const express = require('express');
var jsend = require('jsend');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const RolesService = require('../services/RoleService');
const db = require('../models');
const roleService = new RolesService(db);
router.use(jsend.middleware);
const authenticateToken = require('../securedEndpoint');





// get all roles
router.get('/all', authenticateToken, async function (req, res, next) {
    try {
        const roles = await roleService.getAllRoles();
        res.status(200).jsend.success({ 'result': roles });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});



// create new role
router.post('/create', authenticateToken, jsonParser, async function (req, res, next) {
    try {
        const create_role = req.body.name
        // check if create_role already exist
        const role = await roleService.getRoleByName(create_role);
        if (role) {
            res.status(400).jsend.fail({ 'result': 'Role already exist' });
        }
        else {
            const new_role = await roleService.createRole(create_role);
            res.status(200).jsend.success({ 'result': new_role });
        }
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});


// assign user a role
router.post('/assign', authenticateToken, jsonParser, async function (req, res, next) {
    try {
        const user_id = req.body.user_id;
        const role_id = req.body.role_id;
        const user = await roleService.getUserById(user_id);
        const role = await roleService.getRoleById(role_id);
        if (!user) {
            res.status(400).jsend.fail({ 'result': 'User not found' });
        }
        else if (!role) {
            res.status(400).jsend.fail({ 'result': 'Role not found' });
        }
        else {
            const assign_role = await roleService.assignRole(user_id, role_id);
            res.status(200).jsend.success({ 'result': assign_role });
        }
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});






















































module.exports = router;