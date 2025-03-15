const express = require('express');
const { connectToMongoDB } = require('./connect');
const urlRouter = require('./routes/url');
const path = require('path');
const cookieParser = require('cookie-parser');
const { checkForAuthentication, restrictTo } = require('./middleware/auth');
const URL = require('./models/url');
const staticRoute = require('./routes/staticRoute');
const userRoute = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 8001;

connectToMongoDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/short-url')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use('/url',restrictTo(["NORMAL"]), urlRouter);
app.use('/user', userRoute);
app.use('/', staticRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }
    );
    if (entry) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).send('URL not found');
    }
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => console.log(`Server is running http://localhost:${PORT}`));