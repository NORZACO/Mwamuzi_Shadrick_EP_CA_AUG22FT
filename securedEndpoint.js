const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).json({
      status: 'fail',
      message: 'Missing or invalid JWT token. Please include a valid token in the Authorization header of your request.'
    });
  }
  const options = { expiresIn: '12h', }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, options, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid JWT token. Please include a valid token in the Authorization header of your request.'
      });
    }
    req.user = user;
    next();
  }
  );
}



// export authenticateToken
module.exports = authenticateToken;
