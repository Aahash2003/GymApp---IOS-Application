
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = 'mongodb+srv://saahash:Gorilla2021%40@gymcluster.qdjiyy1.mongodb.net/';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
