const jwt = require('jsonwebtoken');
require('dotenv').config();
const { uid } = require('uid')
const db = require('./models');

console.log('XXXXXXXXXXXXXX:', uid(100));

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];



  if (token == null) {
    req.user = {
      id: `Guest`,
      username: 'Guest',
      // role: `Guest-${uid(20)}`
      role: process.env.ACCESS_GUEST_ROLE
    };
    return next()
  }
  //   status: 'fail',
  //   message: 'Missing or invalid JWT token. Please include a valid token in the Authorization header of your request.'


  const options = { expiresIn: '12h', }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, options, (err, user) => {
    if (err) {
      return res.status(403).jsend.fail({
        message: 'Invalid JWT token. Please include a valid token in the Authorization header of your request.'
      });
    }
    // req.user

    req.user = {
      Email: user.email,
      userId: user.userId,
      role: user.roleId,
      Username: user.username,
      firstName: user.firstname,
      lastName: user.lastName,
    }

    next();
  });
}



// function genarateToken(payload) {
//   const options = { expiresIn: '12h' }
//   return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
// }




// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     // guest user
//     req.user = {
//       id: null,
//       username: 'guest',
//       role: 'guest'
//     }
//     return next()
//   }

//   const options = { expiresIn: '12h', }
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, options, (err, user) => {
//     if (err) {
//       return res.status(403).json({
//         status: 'fail',
//         message: 'Invalid JWT token. Please include a valid token in the Authorization header of your request.'
//       });
//     }
//     req.user = user;
//     // req.user = {
//     //   id: user.id,
//     //   username: user.username,
//     //   role: user.role
//     // }
//     next();
//   }
//   );
// }



// export authenticateToken
module.exports = authenticateToken

