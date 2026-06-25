const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Hashed password pre-save middleware (Refactored for pure async/await)
UserSchema.pre('save', async function() {
  // If the password wasn't modified, just exit the function early
  if (!this.isModified('password')) return;

  // Hash the password cleanly using await
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // No next() function call needed here anymore!
});

// Compare input password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);