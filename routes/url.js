const express = require('express');
const { handleGenerateNewShortURL , handlegetURLAnalytics } = require('../controllers/url');

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get('/analytics/:shortId', handlegetURLAnalytics);

module.exports = router;