// routes/url.js
const express = require('express');
const router = express.Router();

const { restrictTo } = require('../middleware/auth');
const {
  handleGenerateNewShortURL,
  handlegetURLAnalytics,
  handleDeleteShortURL
} = require('../controllers/url');

// 🔹 Generate new short URL (only NORMAL users)
router.post("/", restrictTo(['NORMAL']), handleGenerateNewShortURL);

// 🔹 Get analytics for a short URL (NORMAL + ADMIN)
router.get('/analytics/:shortId', restrictTo(['NORMAL', 'ADMIN']), handlegetURLAnalytics);

// 🔹 Delete a short URL (creator or admin only)
router.delete('/delete/:shortId', restrictTo(['NORMAL', 'ADMIN']), handleDeleteShortURL);

module.exports = router;
