const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isSenderVerified: { type: Boolean, default: false },
  sendgridSenderId: { type: String },
  subscription: {
    status: { type: String, enum: ['none', 'trial', 'active', 'expired', 'cancelled'], default: 'none' },
    plan: { type: String },
    trialEndsAt: { type: Date },
    subscribedAt: { type: Date },
    subscriptionEndsAt: { type: Date },
    razorpayPaymentId: { type: String },
    razorpayOrderId: { type: String },
    razorpaySignature: { type: String },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 