const jwt = require('jsonwebtoken');
const { getUser } = require('../services/auth'); // Ensure the correct path

const checkForAuthentication = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) return res.redirect("/login");
        if (roles.includes(!req.user.role)) return res.end("UnAuthorized");

        next();
    }
}

module.exports = {
    checkForAuthentication,
    restrictTo
};