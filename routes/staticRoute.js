const express = require('express');
const router = express.Router();

const { restrictTo } = require('../middleware/auth');
const URL = require("../models/url");
const User = require('../models/user');



router.get('/', restrictTo(["NORMAL"]), async (req, res) => {
  const allurls = await URL.find({ createdBy: req.user._id })
  const user = await User.findById(req.user._id);
  if (user.role === "ADMIN") {
    return res.redirect('/admin/urls',{
      users: user
    });
  }
  return res.render('home', {
    urls: allurls
  })
});

router.get('/admin/urls', restrictTo(["ADMIN"]), async (req, res)=>{
 const allurls = await URL.find({});
 return res.render('home',{
    urls: allurls,
 })
});
router.get('/signup', (req, res) => {
  return res.render('signup')
})
router.get('/login', (req, res) => {
  return res.render('login')
})

module.exports = router;
