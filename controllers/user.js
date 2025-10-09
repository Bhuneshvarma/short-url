const { setUser } = require('../services/auth');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// 🔹 Handle User Signup
async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render('signup', { error: 'Email already registered!' });
        }


        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "NORMAL", // default role
        });

        return res.status(201).render('login', { message: 'Signup successful! Please log in.' });

    } catch (err) {
        console.error('❌ Signup Error:', err);
        return res.status(500).render('signup', { error: 'Internal Server Error' });
    }
}

// 🔹 Handle User Login
async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).render('login', { error: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render('login', { error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = setUser(user);
        
        // Set secure cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // ✅ true only in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Redirect based on role
        if (user.role === 'ADMIN') {
            return res.redirect('/admin/url');
        } else {
            return res.redirect('/');
        }
    } catch (err) {
        console.error('❌ Login Error:', err);
        return res.status(500).render('login', { error: 'Internal Server Error' });
    }
}

// 🔹 Handle User Logout
function handleUserLogout(req, res) {
    res.clearCookie('token');
    return res.redirect('/login');
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout
};
