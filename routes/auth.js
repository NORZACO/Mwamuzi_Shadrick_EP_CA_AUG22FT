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
const { stringify } = require('node:querystring');


// Handle POST requests to /register
router.post("/signup", async (req, res, next) => {
   const { username, email, roleId, password } = req.body;

   // Check for missing fields
   if (!username || !email || !password) {
      // Create an error message with a list of missing fields
      const missingFields = [];
      if (!username) missingFields.push('username');
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!roleId) missingFields.push('roleId');

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
   if (!userWithEmail) {
      // Return a Jsend fail response with an error message
      return res.status(400).jsend.fail({ 'result': 'Email is already usedxx' });
   }

   // Check if roleId is in database
   const userWithRoleId = await userService.getUserRoleId(roleId);
   if (!userWithRoleId) {
      // Return a Jsend fail response with an error message
      return res.status(400).jsend.fail({ 'result': 'RoleId  is not found or may be deleted' });
   }

   //Rejex  Check if roleId is a number
   const roleIdRegex = /^[0-9]+$/;
   if (!roleIdRegex.test(roleId)) {
      // Return a Jsend fail response with an error message
      return res.status(400).jsend.fail({ 'result': 'RoleId must be a number' });
   }


   var salt = crypto.randomBytes(16);
   // Hash the password with PBKDF2 and the random salt
   Buffer.alloc(password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) {
         // Pass the error to the error handling middleware function
         return next(err);
      }
      // Create a new user in the database with the hashed password and salt
      //     // INSERT INTO `stocksalesdb`.`users` (`id`, `username`, `email`, `encryptedPassword`, `salt`, `roleId`) VALUES (NULL, NULL, NULL, NULL, NULL, NULL)
      userService.createUser(username, email, hashedPassword, salt, roleId)
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




/*

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
   })



   // Retrieve the user with the given email from the database
   userService.getUserByEmail(email).then((data) => {
      if (data) {
         // If the user does not exist, return a Jsend fail response
         //    return res.status(400).jsend.fail({ "result": "Incorrect email or password" });
         // }

         // Hash the provided password with the stored salt
         crypto.pbkdf2(password, stringify(data.salt), 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
               return cb(err);
            }
            // Compare the hashed password with the stored hashed password
            if (!crypto.timingSafeEqual(data.encryptedPassword, hashedPassword)) {
               // If the passwords do not match, return a Jsend fail response
               return res.status(400).jsend.fail({ "result": "Incorrect email or password" });
            }


            // Create a JWT token
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
      }
   });
});

// });

*/

// Route for user login
router.post("/login", jsonParser, async (req, res, next) => {
   // Extract email and password from request body
   const { email, password } = req.body;

   // Get user data from database by email
   userService.getOne(email).then((data) => {
      // If user not found, return error
      if (data === null) {
         return res.jsend.fail({ "result": "Incorrect email or password" });
      }

      // Verify password using PBKDF2
      crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
         if (err) { return cb(err); }

         // If password doesn't match, return error
         if (!crypto.Buffer(data.encryptedPassword, hashedPassword)) {
            return res.jsend.fail({ "result": "Incorrect email or password" });
         }

         // If password matches, create a JWT token
         let token;
         try {
            token = jwt.sign(
               { id: data.id, email: data.email },
               process.env.ACCESS_TOKEN_SECRET,
               { expiresIn: "1h" }
            );
         } catch (err) {
            res.jsend.error("Something went wrong with creating JWT token")
         }

         // Return success with user data and JWT token
         res.jsend.success({ "result": "You are logged in", "id": data.id, email: data.email, token: token });
      });
   });
});



// Handle POST requests to /logout
router.post("/logout", async (req, res, next) => {
   // Retrieve the user with the given email from the database
   const { email } = req.body
   userService.getUserByEmail(email).then((data) => {
      if (data === null) {
         // If the user does not exist, return a Jsend fail response
         return res.status(400).jsend.fail({ "result": "Incorrect email or password" });
      }
      // Delete the JWT token from the cookie
      res.clearCookie("token");
      // Return a Jsend success response
      return res.status(200).jsend.success({ "result": "You are logged out" });
   });
});



// Handle POST requests to /forgot-password
router.post("/forgot-password", jsonParser, async (req, res, next) => {
   const { email } = req.body;
   // Retrieve the user with the given email from the database
   userService.getUserByEmail(email).then((data) => {
      if (data === null) {
         // If the user does not exist, return a Jsend fail response
         return res.status(400).jsend.fail({ "result": "Incorrect email or password" });
      }
      // Create a JWT token
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
      // Send an email to the user with the token
      const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
         }
      });
      const mailOptions = {
         from: process.env.EMAIL_ADDRESS,
         to: email,
         subject: 'Reset password',
         text: `Click on the link to reset your password: http://localhost:3000/reset-password/${token}`
      };
      transporter.sendMail(mailOptions, function (error, info) {
         if (error) {
            // Pass the error to the error handling middleware function
            return next(error);
         } else {
            // Return a Jsend success response
            return res.status(200).jsend.success({ "result": "An email has been sent to you" });
         }
      });
   });
});


// UPDATE USER
router.put("/byid/:id", jsonParser, async (req, res, next) => {
   const { id } = req.params;
   const { username, email, password, roleId } = req.body;
   // Retrieve the user with the given id from the database
   userService.getUserById(id).then((data) => {
      if (data === null) {
         // If the user does not exist, return a Jsend fail response
         return res.status(400).jsend.fail({ "result": "User does not exist" });
      }
      // Check for missing fields
      if (!username || !email || !password || !roleId) {
         // Create an error message with a list of missing fields
         const missingFields = [];
         if (!username) missingFields.push('username');
         if (!email) missingFields.push('email');
         if (!password) missingFields.push('password');
         if (!roleId) missingFields.push('roleId');
         // Return a Jsend fail response with an error message
         return res.status(400).jsend.fail({
            'result': `Missing ${missingFields.join(', ')} fieds`,
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
      // Hash the password
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function (err, encryptedPassword) {
         if (err) {
            return next(err);
         }
         // Update the user in the database
         userService.updateUser(id, username, email, encryptedPassword, salt, roleId).then((data) => {
            // Return a Jsend success response
            return res.status(200).jsend.success({
               "result": "User updated",
               "id": data.id,
               "username": data.username,
               "email": data.email,
               "roleId": data.roleId
            });
         });
      });
   });
});



// DELETE USER
router.delete("/:id", async (req, res, next) => {
   const { id } = req.params;
   // Retrieve the user with the given id from the database
   userService.getUserById(id).then((data) => {
      if (data === null) {
         // If the user does not exist, return a Jsend fail response
         return res.status(400).jsend.fail({ "result": "User does not exist" });
      }
      // Delete the user from the database
      userService.deleteUser(id).then((data) => {
         // Return a Jsend success response
         return res.status(200).jsend.success({ "result": "User deleted" });
      });
   });
});


// GET USER ROLES
router.get("/roles", async (req, res, next) => {
   // Retrieve all user roles from the database  
   userService.getUserRoles().then((data) => {
      // Return a Jsend success response
      return res.status(200).jsend.success(data);
   });
});


// GET USER ROLE
router.get("/roles/:id", async (req, res, next) => {
   const { id } = req.params;
   // Retrieve the user role with the given id from the database
   userService.getUserRoleById(id).then((data) => {
      if (data === null) {
         // If the user role does not exist, return a Jsend fail response
         return res.status(400).jsend.fail({ "result": "User role does not exist" });
      }
      // Return a Jsend success response
      return res.status(200).jsend.success(data);
   });
});


// CREATE USER ROLE
router.post("/roles", jsonParser, async (req, res, next) => {
   const { name } = req.body;
   // Check for missing fields
   if (!name) {
      // Return a Jsend fail response with an error message
      return res.status(400).jsend.fail({ 'result': "Missing name field" });
   }
   // Create the user role in the database
   userService.createUserRole(name).then((data) => {
      // Return a Jsend success response
      return res.status(200).jsend.success({
         "result": "User role created",
         "id": data.id,
         "name": data.name
      });
   });
});


// UPDATE USER ROLE
router.put("/roles/:id", jsonParser, async (req, res, next) => {
   const { id } = req.params;
   const { name } = req.body;
   // Retrieve the user role with the given id from the database
   userService.getUserRoleById(id).then((data) => {
      if (data === null) {
         // If the user role does not exist, return a Jsend fail response
         return res.status(400).jsend.fail({ "result": "User role does not exist" });
      }
      // Check for missing fields
      if (!name) {
         // Return a Jsend fail response with an error message
         return res.status(400).jsend.fail({ 'result': "Missing name field" });
      }
      // Update the user role in the database
      userService.updateUserRole(id, name).then((data) => {
         // Return a Jsend success response
         return res.status(200).jsend.success({
            "result": "User role updated",
            "id": data.id,
            "name": data.name
         });
      });
   });
});
// DELETE USER ROLE
router.delete("/roles/:id", async (req, res, next) => {
   const { id } = req.params;
   // Retrieve the user role with the given id from the database
   userService.getUserRoleById(id).then((data) => {
      if (data === null) {
         // If the user role does not exist, return a Jsend fail response
         return res.status(400).jsend.fail({ "result": "User role does not exist" });
      }
      // Delete the user role from the database
      userService.deleteUserRole(id).then((data) => {
         // Return a Jsend success response
         return res.status(200).jsend.success({ "result": "User role deleted" });
      });
   });
});
// GET USER ROLES




// Export the router object
module.exports = router;
