// checkAdminAuth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();


const checkAdminAuth = (req, res, next) => {
    const token = req.cookies['auth-token'];
    if (!token) {
        return res.status(401).jsend.fail({ "result": "missing fields" });
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if (verified.role !== 'Admin') {
            return res.status(401).jsend.fail({ "result": "unauthorized" });
        }
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).jsend.fail({ "result": "unauthorized" });
    }
}


module.exports = checkAdminAuth;