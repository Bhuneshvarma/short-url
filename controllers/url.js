const shortid = require('shortid');
const URL = require('../models/url');
const User = require('../models/user');

// 🔹 Generate New Short URL
async function handleGenerateNewShortURL(req, res) {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortID = shortid.generate();

    try {
        // Save new short URL in DB
        await URL.create({
            shortId: shortID,
            redirectURL: url,
            visitHistory: [],
            createdBy: req.user._id,
        });

        // ✅ Redirect to home page with newShortId as query parameter
        return res.redirect('/?newShortId=' + shortID);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// 🔹 Get URL Analytics
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

// 🔹 Delete Short URL
async function handleDeleteShortURL(req, res) {
    const { shortId } = req.params;

    try {
        const urlEntry = await URL.findOne({ shortId });

        if (!urlEntry) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Ensure only creator or admin can delete
        if (req.user.role !== 'ADMIN' && String(urlEntry.createdBy) !== String(req.user._id)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await URL.deleteOne({ shortId });

        // ✅ Send JSON response instead of redirect
        return res.json({ message: 'URL deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    handleGenerateNewShortURL,
    handlegetURLAnalytics,
    handleDeleteShortURL
};
