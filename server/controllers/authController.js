const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.TOKEN_EXPIRES_IN
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch {
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Make sure this returns _id
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};