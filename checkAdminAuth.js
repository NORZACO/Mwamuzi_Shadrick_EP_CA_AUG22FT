const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || null) {
        // No token provided, treat as guest user
        req.user = {
            id: "Guest",
            username: 'Guest',
            role: 'Guest'
        };
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'fail',
                message: `Invalid JWT token. Please include a valid token in the Authorization header of your request.`
            });
        }
        req.user = user;
        next();
    });
}

function authorizeRoles(roles) {
    return (req, res, next) => {
        const { role } = req.user;

        if (!roles.includes(role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'Access denied. You do not have permission to perform this operation.'
            });
        }

        next();
    }
}

module.exports = {
    authenticateToken,
    authorizeRoles
};


