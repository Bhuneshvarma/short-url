const jwt = require('jsonwebtoken');
const secret = process.env.TOKEN_SECRET
function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
    }, secret
    );
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        throw new Error('Invalid Token');
    }
}

module.exports = {
    setUser,
    getUser
};