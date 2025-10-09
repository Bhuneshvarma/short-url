const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

let isConnected = false;

async function connectToMongoDB(uri) {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw new Error('Failed to connect to MongoDB');
  }
}

module.exports = { connectToMongoDB };
