require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./models/User');

const ask = (question) => new Promise((resolve) => {
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
  prompt.question(question, (answer) => {
    prompt.close();
    resolve(answer.trim());
  });
});

const askSecret = (question) => new Promise((resolve, reject) => {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    reject(new Error('Set ADMIN_PASSWORD in .env when running the seed command without an interactive terminal.'));
    return;
  }

  const input = process.stdin;
  let answer = '';
  const restoreInput = () => {
    input.removeListener('data', onData);
    input.setRawMode(false);
    input.setEncoding(null);
    input.pause();
    process.stdout.write('\n');
  };
  const onData = (key) => {
    if (key === '\u0003') {
      restoreInput();
      reject(new Error('Admin setup cancelled.'));
    } else if (key === '\r' || key === '\n') {
      restoreInput();
      resolve(answer);
    } else if (key === '\u007f' || key === '\b') {
      answer = answer.slice(0, -1);
    } else if (key >= ' ' && key !== '\u007f') {
      answer += key;
    }
  };

  process.stdout.write(question);
  input.setEncoding('utf8');
  input.setRawMode(true);
  input.resume();
  input.on('data', onData);
});

const seedAdmin = async () => {
  let connected = false;
  try {
    const { MONGO_URI, ADMIN_RESET_PASSWORD } = process.env;
    if (!MONGO_URI) {
      throw new Error('Set MONGO_URI in .env before seeding.');
    }

    await mongoose.connect(MONGO_URI);
    connected = true;
    console.log('☘️ Connected to MongoDB for seeding...');

    const username = process.env.ADMIN_USERNAME || await ask('Choose an admin username: ');
    const password = process.env.ADMIN_PASSWORD || await askSecret('Choose an admin password (input hidden): ');
    if (!username || !password) throw new Error('Admin username and password are required.');
    if (password.length < 12) throw new Error('The admin password must be at least 12 characters long.');

    // Check if an admin already exists
    const adminExists = await User.findOne({ username });
    if (adminExists) {
      if (ADMIN_RESET_PASSWORD !== 'true') {
        console.log('ℹ️ Admin user already exists. Set ADMIN_RESET_PASSWORD=true in .env to explicitly reset its password, then rerun this command.');
        return;
      }

      adminExists.password = password;
      await adminExists.save();
      console.log(`✅ Password reset for admin "${username}".`);
      return;
    }

    // Create new admin user (The model will automatically hash this password)
    const admin = new User({
      username,
      password
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
  } catch (err) {
    if (err.message.includes('ECONNREFUSED')) {
      console.error('❌ MongoDB is not accepting connections. Start the MongoDB service and confirm it is listening on the port in MONGO_URI, then rerun npm run seed:admin.');
    } else {
      console.error('❌ Admin setup failed:', err.message);
    }
    process.exitCode = 1;
  } finally {
    if (connected) await mongoose.disconnect();
  }
};

seedAdmin();