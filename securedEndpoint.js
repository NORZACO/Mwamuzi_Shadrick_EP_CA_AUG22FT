const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).json({
      status: 'fail',
      message: 'Missing or invalid JWT token. Please include a valid token in the Authorization header of your request.'
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid JWT token. Please include a valid token in the Authorization header of your request.'
      });
    }
    req.user = user;
    next();
  });
}



// export authenticateToken
module.exports = authenticateToken;
