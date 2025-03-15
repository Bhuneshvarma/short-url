const shortid = require('shortid');
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    const requestBody = req.body;
    if (!requestBody.url) {
        return res.status(400).json({ error: 'url is required' });
    }
    const shortID = shortid.generate();
    try {
        await URL.create({
            shortId: shortID,
            redirectURL: requestBody.url,
            visitHistory: [],
            createdBy: req.user._id,
        });
        return res.render('home',{ id: shortID });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handlegetURLAnalytics(req, res) {
    const { shortId } = req.params;
    let result;
    try {
        result = await URL.findOne({ shortId });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!result) {
        return res.status(404).json({ error: 'URL is not found' });
    }
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handlegetURLAnalytics
};