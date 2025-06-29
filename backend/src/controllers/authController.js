const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    // If this is the first user, make them admin
    const userCount = await User.countDocuments();
    let assignedRole = 'user';
    if (userCount === 0) {
      assignedRole = 'admin';
    } else if (role && req.user && req.user.role === 'admin') {
      assignedRole = role;
    }
    const user = new User({ email, password, name, role: assignedRole });
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const userResponse = { id: user._id, email: user.email, name: user.name, role: user.role, isSenderVerified: user.isSenderVerified, subscription: user.subscription };
    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const userResponse = { id: user._id, email: user.email, name: user.name, role: user.role, isSenderVerified: user.isSenderVerified, subscription: user.subscription };
    res.json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 