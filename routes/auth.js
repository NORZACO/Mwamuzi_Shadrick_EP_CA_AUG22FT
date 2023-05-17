var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var crypto = require('node:crypto');
var UserService = require("../services/UserService")
var userService = new UserService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
router.use(jsend.middleware);
var jwt = require('jsonwebtoken');


// Handle POST requests to /register
router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check for missing fields
  if (!username || !email || !password) {
    // Create an error message with a list of missing fields
    const missingFields = [];
    if (!username) missingFields.push('username');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');

    // Return a Jsend fail response with an error message
    return res.status(400).jsend.fail({
      'result': `Missing required ${missingFields.join(', ')} fields`,
      'you forget to fill': missingFields.join(', ')
    });
  }

  // Check for valid email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    // Return a Jsend fail response with an error message
    return res.status(400).jsend.fail({ 'result': 'Invalid email format' });
  }

  // Check if email is already used
  const userWithEmail = await userService.getUserByEmail(email);
  if (userWithEmail) {
    // Return a Jsend fail response with an error message
    return res.status(400).jsend.fail({ 'result': 'Email is already used' });
  }


  var salt = crypto.randomBytes(16);
  // Hash the password with PBKDF2 and the random salt
  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
    if (err) {
      // Pass the error to the error handling middleware function
      return next(err);
    }
    // Create a new user in the database with the hashed password and salt
    userService.createUser(username, email, hashedPassword, salt)
      .then(() => {
        // Return a Jsend success response
        res.jsend.success({ "result": "You created an account." });
      })
      .catch((err) => {
        // Pass the error to the error handling middleware function
        next(err);
      });
  });
});


// Handle POST requests to /login
router.post("/login", jsonParser, async (req, res, next) => {
  const { email, password } = req.body;


  // Check for missing fields
  if (!email || !password) {
    // Create an error message with a list of missing fields
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');

    // Return a Jsend fail response with an error message
    return res.status(400).jsend.fail({
      'result': `Missing ${missingFields.join(', ')} fieds`,
      // required_fields : missingFields.join(', ')
    });
  }

  // Validate the email format using regex
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    // Return a Jsend fail response with an error message
    return res.status(400).jsend.fail({ 'result': "Invalid email format" });
  }

  // Validate the password format
  if (typeof password !== "string" || password.trim().length < 8) {
    // Return a Jsend fail response with an error message
    return res.status(400).jsend.fail({ 'result': "Password must be at least 8 characters long" });
  }

  // Retrieve the user with the given email from the database
  userService.getUserByEmail(email).then((data) => {
    if (data === null) {
      // If the user does not exist, return a Jsend fail response
      return res.status(400).jsend.fail({ "result": "Incorrect email or password" });
    }


    // Retrieve the user with the given email from the database
    userService.getUserByEmail(email).then((data) => {
      if (data === null) {
        // If the user does not exist, return a Jsend fail response
        return res.status(400).jsend.fail({ "result": "Incorrect email or password" });
      }

      // Hash the provided password with the stored salt
      crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) {
          return cb(err);
        }
        // Compare the hashed password with the stored hashed password
        if (!crypto.Certificate(data.encryptedPassword, hashedPassword)) {
          // If the passwords do not match, return a Jsend fail response
          return res.status(400).jsend.fail({ "result": "Incorrect email or password" });
        }


        let token;
        try {
          token = jwt.sign(
            { id: data.id, email: data.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1 day" }
          );
        } catch (err) {
          return res.status(500).jsend.error("Something went wrong with creating JWT token");
        }

        return res.status(200).jsend.success({
          "result": "You are logged in",
          "id": data.id,
          "email": data.email,
          "token": token
        });
      });
    });
  });
});





// Export the router object
module.exports = router;
