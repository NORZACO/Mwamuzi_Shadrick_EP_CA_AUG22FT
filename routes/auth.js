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
   const user = await userService.checktUserByEmail(email);
   if (user) {
      res.jsend.fail({ message: "Email already exists" });
   }
   //  get category id
   const category = await userService.getUserRoleId(roleId)
   if (!category) {
      res.jsend.fail({ message: "Category does not exist" });
   }
   //bcrypt
   const santRount = 10
   // const salt = await bcrypt.genSalt(santRount);
   const hash = await bcrypt.hash(password, santRount);
   // register
   const userIn = await userService.createUser(username, email, hash, roleId);
   res.status(200).jsend.success({ "result": "You are new been registered"});
});




router.post('/login', jsonParser, async function (req, res, next) {
   const { email, password } = req.body;
   const user = await userService.getUserByEmail(email);

   if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
   }


   bcrypt.compare(password, String(user[0]?.encryptedPassword), function (err, result) {
      if (err) {
         return res.status(500).jsend.fail({ 'result': err.message /*, 'text' :  'x' + ' ' + user[0]?.encryptedPassword */ });
      }
      let token;
      if (result === true) {
         // try
         try {
            token = jwt.sign({ email: user[0]?.email, userId: user[0]?.id }, process.env.ACCESS_TOKEN_SECRET, {
               expiresIn: "1h"
            });
         } catch (err) {
            return res.status(401).json({ 'result' : err.message });
         }
         return res.status(200).json({
            'result' : "Auth successful",
            token: token
         });
      }
      else {
         return res.status(401).json({ 'result' : 'Invalid password or email address' });
      }
   });
});








module.exports = router;

