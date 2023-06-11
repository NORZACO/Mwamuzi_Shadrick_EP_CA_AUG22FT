// dotenev
require('dotenv').config();
var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
// var crypto = require('node:crypto');
const bcrypt = require('bcrypt');

const UserService = require("../services/UserService");
const userService = new UserService(db);
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsend.middleware);
const jwt = require('jsonwebtoken');
const { token } = require('morgan');



router.post('/signup', jsonParser, async function (req, res, next) {
   const { firstName, lastName, username, email, roleId, password } = req.body;
   const missingField = [];
   if (!firstName) missingField.push('firstName');
   if (!lastName) missingField.push('lastName');
   if (!username) missingField.push('username');
   if (!email) missingField.push('email');
   if (!roleId) missingField.push('roleId');
   if (!password) missingField.push('password');
   if (missingField.length > 0) {
      return res.status(400).jsend.fail({ 'result': 'Missing fields', 'fields': missingField });
   }

   // regex firstName
   const regexfirstName = /^[a-zA-Z0-9]{3,30}$/;
   if (!regexfirstName.test(firstName)) {
      return res.status(400).jsend.fail({ 'result': 'Username must be between 3 and 30 characters long and contain only letters and numbers' });
   }

   // regex lastName
   const regexlastName = /^[a-zA-Z0-9]{3,30}$/;
   if (!regexlastName.test(lastName)) {
      return res.status(400).jsend.fail({ 'result': 'Username must be between 3 and 30 characters long and contain only letters and numbers' });
   }

   // regex username
   const regexUsername = /^[a-zA-Z0-9_]{3,30}$/;
   if (!regexUsername.test(username)) {
      return res.status(400).jsend.fail({ 'result': 'Username must be between 3 and 30 characters long and contain only letters and numbers and underscore' });
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

      await userService.createUser(firstName, lastName, username, email, password, roleId);
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
   const { username, password } = req.body;

   const missingField = [];
   if (!username) missingField.push('username');
   if (!password) missingField.push('password');
   if (missingField.length > 0) {
      return res.status(400).jsend.fail({ 'result': 'Missing fields', 'fields': missingField });
   }// regex email


   // regex password
   const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
   if (!regexPassword.test(password)) {
      return res.status(400).jsend.fail({ 'result': 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character' });
   }

   const user = await userService.find_user(username);

   if (!user) {
      return res.status(400).json({ 'result': "Email does not exist" });
   }

   bcrypt.compare(password, String(user[0]?.encryptedPassword), (err, result) => {
      if (err) {
         return res.status(500).jsend.fail({ 'result': err.message /*, 'text' :  'x' + ' ' + user[0]?.encryptedPassword */ });
      }
      let token;
      if (result === true) {

         // const options = { expiresIn: '1h' }
         // curent time stamp
         const current_time_stamp = Math.floor(Date.now() / 1000) // curent time in secoonds
         // const options = { expiresIn: current_time_stamp + 60 * 60 * 1 } // 1 hour
         // const options = { expiresIn: current_time_stamp + (60 * 60 * 24 * 1) } // 1 day
         // const options = { expiresIn: current_time_stamp + 60 * 60 * 24 * 7 } // 7 days
         // const options = { expiresIn: current_time_stamp + 60 * 60 * 24 * 30 } // 30 days
         // 12 minutes
         // const options = { expiresIn: current_time_stamp + (60 * 12) } // 12 minutes
         // 12 seconds
         // const options = { expiresIn: current_time_stamp + 12 } // 12 seconds

         const options = { expiresIn: '24h' }
         try {
            token = jwt.sign({
               email: user[0]?.email,
               userId: user[0]?.id,
               roleId: user[0]?.roleId,
               username: user[0]?.username,
               firstname: user[0]?.firstName,
               lastName: user[0]?.lastName,
            },
               process.env.ACCESS_TOKEN_SECRET, options);
         } catch (err) {
            return res.status(401).json({ 'result': err.message });
         }
         return res.status(200).json({
            'result': "Auth successful",
            Token: token,
            'User': {
               userId: user[0]?.id,
               roleId: user[0]?.roleId,
               username: user[0]?.username,
            }
         });
      }
      else {
         return res.status(401).json({ 'result': 'Invalid password or email address' });
      }
   });
});




//logout




module.exports = router;

