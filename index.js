const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectToMongoDB } = require('./connect');
const { checkForAuthentication, restrictTo } = require('./middleware/auth');

const urlRouter = require('./routes/url');
const userRoute = require('./routes/user');
const staticRoute = require('./routes/staticRoute');
const URL = require('./models/url');


const app = express();
const PORT = process.env.PORT || 5000; // ✅ Default fallback port

// 🟢 Connect to MongoDB
connectToMongoDB(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ Failed to connect to MongoDB:', err.message));

// 🧱 View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// 🧩 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

// 🧭 Routes
app.use('/', staticRoute);
app.use('/url', restrictTo(['NORMAL']), urlRouter);
app.use('/user', userRoute);

// 🔗 Redirect Handler for Short URLs
app.get('/url/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).send('URL not found');
    }

    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
