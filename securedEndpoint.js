const jwt = require('jsonwebtoken');
require('dotenv').config();

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

  const options = { expiresIn: '24h' } // 2 minutes

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

