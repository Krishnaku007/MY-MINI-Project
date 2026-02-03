// MongoDB connection handler
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/museum_ticketing';

const connectDatabase = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
};

module.exports = connectDatabase;
