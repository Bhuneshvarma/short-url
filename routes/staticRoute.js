const express = require('express');
const router = express.Router();

const { restrictTo } = require('../middleware/auth');
const URL = require('../models/url');
const User = require('../models/user');

// Dashboard / Home route
// routes/staticRoute.js (or wherever '/‘ route is)
router.get('/', restrictTo(['NORMAL', 'ADMIN']), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.redirect('/user/login');
    }

    let allurls;
    if (user.role === 'ADMIN') {
      allurls = await URL.find({});
    } else {
      allurls = await URL.find({ createdBy: req.user._id });
    }

    // Pass newShortId if present in query
    const newShortId = req.query.newShortId || null;

    return res.render('home', { urls: allurls, user, newShortId });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});


// Admin dashboard (direct route)
router.get('/admin/urls', restrictTo(['ADMIN']), async (req, res) => {
  try {
    const allurls = await URL.find({});
    const user = await User.findById(req.user._id);
    return res.render('home', { urls: allurls, user });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

// Signup route
router.get('/signup', (req, res) => {
  return res.render('signup');
});

// Login route
router.get('/login', (req, res) => {
  return res.render('login');
});

module.exports = router;
