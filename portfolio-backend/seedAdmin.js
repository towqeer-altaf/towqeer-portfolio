require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('☘️ Connected to MongoDB for seeding...');

    // Check if an admin already exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('ℹ️ Admin user already exists!');
      process.exit(0);
    }

    // Create new admin user (The model will automatically hash this password)
    const admin = new User({
      username: 'admin',
      password: 'SuperSecurePassword123' // Change this to your desired password!
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedAdmin();