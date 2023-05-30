// dotenev
require('dotenv').config();
var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
// var crypto = require('node:crypto');
const bcrypt = require('bcrypt');

var UserService = require("../services/UserService")
var userService = new UserService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
router.use(jsend.middleware);
var jwt = require('jsonwebtoken');
const db2 = require('../models');
const User = require('../models/User');



router.post('/signup', jsonParser, async function (req, res, next) {
   const { username, email, roleId, password } = req.body;
   const missingField = [];
   if (!username) missingField.push('username');
   if (!email) missingField.push('email');
   if (!roleId) missingField.push('roleId');
   if (!password) missingField.push('password');
   if (missingField.length > 0) {
      return res.status(400).jsend.fail({ 'result': 'Missing fields', 'fields': missingField });
   }

   // regex username
   const regexUsername = /^[a-zA-Z0-9]{3,30}$/;
   if (!regexUsername.test(username)) {
      return res.status(400).jsend.fail({ 'result': 'Username must be between 3 and 30 characters long and contain only letters and numbers' });
   }

   // regex email
   const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   if (!regexEmail.test(email)) {
      return res.status(400).jsend.fail({ 'result': 'Email must be a valid email address' });
   }
   // regex password
   const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
   if (!regexPassword.test(password)) {
      return res.status(400).jsend.fail({ 'result': 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character' });
   }
   try {

      await userService.createUser(username, email, password, roleId);
      res.status(200).jsend.success(
         {
            "result": "You are new been registered ",
            "Login": 'http://127.0.0.1:3000/login'
         });
   } catch (error) {
      res.status(400).jsend.fail({ 'result': error.message });
   }
});




router.post('/login', jsonParser, async function (req, res, next) {
   const { email, password } = req.body;

   const missingField = [];
   if (!email) missingField.push('email');
   if (!password) missingField.push('password');
   if (missingField.length > 0) {
      return res.status(400).jsend.fail({ 'result': 'Missing fields', 'fields': missingField });
   }// regex email
   const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   if (!regexEmail.test(email)) {
      return res.status(400).jsend.fail({ 'result': 'Email must be a valid email address' });
   }
   // regex password
   const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
   if (!regexPassword.test(password)) {
      return res.status(400).jsend.fail({ 'result': 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character' });
   }

   const user = await userService.getUserByEmail(email);

   if (!user) {
      return res.status(400).json({ 'result': "Email does not exist" });
   }

   bcrypt.compare(password, String(user[0]?.encryptedPassword), function (err, result) {
      if (err) {
         return res.status(500).jsend.fail({ 'result': err.message /*, 'text' :  'x' + ' ' + user[0]?.encryptedPassword */ });
      }
      let token;
      if (result === true) {
         // try
         try {
            token = jwt.sign({ email: user[0]?.email, userId: user[0]?.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1 day" });
         } catch (err) {
            return res.status(401).json({ 'result': err.message });
         }
         return res.status(200).json({
            'result': "Auth successful",
            token: token
         });
      }
      else {
         return res.status(401).json({ 'result': 'Invalid password or email address' });
      }
   });
});




//logout
router.post('/logout', jsonParser, async function (req, res, next) {
   const { email } = req.body;
   const missingField = [];
   if (!email) missingField.push('email');
   if (missingField.length > 0) {
      return res.status(400).jsend.fail({ 'result': 'Missing fields', 'fields': missingField });
   }
   // regex email
   const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   if (!regexEmail.test(email)) {
      return res.status(400).jsend.fail({ 'result': 'Email must be a valid email address' });
   }
   const user = await userService.getUserByEmail(email);
   if (!user) {
      return res.status(400).json({ 'result': "Email does not exist" });
   }
   return res.status(200).json({
      'result': "Logout successful",
      token: null
   });
});




module.exports = router;

