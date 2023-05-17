const express = require('express');
var jsend = require('jsend');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const UserService = require('../services/UserService');
const db = require('../models');
const userService = new UserService(db);
router.use(jsend.middleware);
const authenticateToken = require('../securedEndpoint');




// router.post('/create', jsonParser, async function (req, res, next) {
//   const { username, email, encryptedPassword, salt } = req.body;
//   try {
//     const user = await userService.createUser(username, email, encryptedPassword, salt);
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get('/all', async function (req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).jsend.success({' result' : users});
  } catch (error) {
    res.status(500).jsend.fail({ 'result': error.message });
  }
});




router.get('/', authenticateToken, async function (req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(jsend.success(users));
  } catch (error) {
    res.status(500).json(jsend.error('Unable to retrieve users', { error: error.message }));
  }
});

router.get('/:id', authenticateToken, async function (req, res, next) {
  const userId = req.params.id;
  try {
    const user = await userService.getUserById(userId);
    res.status(200).json(jsend.success(user));
  } catch (error) {
    res.status(404).json(jsend.error('User not found', { error: error.message }));
  }
});

router.put('/:id', authenticateToken,  jsonParser, async function (req, res, next) {
  const userId = req.params.id;
  const { name, email, encryptedPassword, salt } = req.body;
  try {
    const result = await userService.updateUser(userId, name, email, encryptedPassword, salt);
    res.status(200).json(jsend.success(result));
  } catch (error) {
    res.status(404).json(jsend.error('Unable to update user', { error: error.message }));
  }
});

router.delete('/:id', authenticateToken,  async function (req, res, next) {
  const userId = req.params.id;
  try {
    const result = await userService.deleteUser(userId);
    res.status(200).json(jsend.success(result));
  } catch (error) {
    res.status(404).json(jsend.error('Unable to delete user', { error: error.message }));
  }
});

router.get('/:id/todos', authenticateToken,  async function (req, res, next) {
  const userId = req.params.id;
  try {
    const todos = await userService.getUserTodos(userId);
    res.status(200).json(jsend.success(todos));
  } catch (error) {
    res.status(404).json(jsend.error('Unable to retrieve todos', { error: error.message }));
  }
});

module.exports = router;


