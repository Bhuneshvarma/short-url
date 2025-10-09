const { getUser } = require('../services/auth');

// 🔑 Attach user to request if authenticated
function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    req.user = null;
    console.log("🔑 Checking authentication:", tokenCookie);

    if (!tokenCookie) return next();

    try {
        const user = getUser(tokenCookie);
        if (user) req.user = user;
    } catch (err) {
        console.error("❌ Invalid token:", err.message);
    }

    next();
}

// 🔒 Restrict route access based on roles
function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) return res.redirect('/login'); // Use /user/login to match your route
        if (!roles.includes(req.user.role)) return res.status(403).send('Unauthorized');
        next();
    };
}

module.exports = { checkForAuthentication, restrictTo };
