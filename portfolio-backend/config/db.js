const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`☘️ MongoDB Datastore cluster mounted: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection fault vector: ${error.message}`);
    process.exit(1); // Force immediate engine termination on initialization failure
  }
};

module.exports = connectDB;