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





//GET ALL ROLES
router.get('/roles', authenticateToken, async function (req, res, next) {
    try {
        const roles = await roleService.getAllRoles();
        res.status(200).jsend.success({ 'result': roles });
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});



// create new role
router.post('/role', authenticateToken, jsonParser, async function (req, res, next) {
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


// getUserRoleId
router.get('/role/:roleId', authenticateToken, async function (req, res, next) {
    try {
        const roleId = req.params.roleId;
        const role = await roleService.getRoleById(roleId);
        if (role) {
            res.status(200).jsend.success({ 'result': role });
        }
        else {
            res.status(400).jsend.fail({ 'result': 'Role not found' });
        }
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});



// updateRole
router.put('/role/:roleId', authenticateToken, jsonParser, async function (req, res, next) {
    try {
        const roleId = req.params.roleId;
        const role = await roleService.getRoleById(roleId);
        if (role) {
            const update_role = req.body.name;
            const role = await roleService.getRoleByName(update_role);
            if (role) {
                res.status(400).jsend.fail({ 'result': 'Role already exist' });
            }
            else {
                const Newupdate_role = await roleService.updateRole(roleId, update_role);
                res.status(200).jsend.success({ 'result': Newupdate_role });
            }
        }
        else {
            res.status(400).jsend.fail({ 'result': 'Role not found' });
        }
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});
















// deleteRole
router.delete('/role/:roleId', authenticateToken, async function (req, res, next) {
    try {
        const roleId = req.params.roleId;
        const role = await roleService.getRoleById(roleId);
        if (role) {
            const delete_role = await roleService.deleteRole(roleId);
            res.status(200).jsend.success({ 'result': delete_role });
        }
        else {
            res.status(400).jsend.fail({ 'result': 'Role not found' });
        }
    } catch (error) {
        res.status(500).jsend.fail({ 'result': error.message });
    }
});



module.exports = router;