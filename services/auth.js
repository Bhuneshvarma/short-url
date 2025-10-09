const jwt = require('jsonwebtoken');
const secret = process.env.TOKEN_SECRET;

// 🔹 Create JWT token
function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        secret,
        { expiresIn: '7d' } // Token expires in 7 days
    );
}

// 🔹 Verify and decode token
function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        console.error('❌ Token verification failed:', err.message);
        return null;
    }
}

module.exports = {
    setUser,
    getUser
};
