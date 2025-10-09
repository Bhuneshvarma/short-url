// connect.js
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToMongoDB(uri) {
    if (cached.conn) {
        return cached.conn; // return cached connection
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = { connectToMongoDB };
