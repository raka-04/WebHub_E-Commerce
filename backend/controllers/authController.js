const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//creating a new account
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking for dublicates...
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "This email is already registered." });

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName: name, email, password: securedPassword });
    await newUser.save();

    res.status(201).json({ message: "Registration successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong on our end. Please try again...." });
  }
};

// logging portion
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRecord = await User.findOne({ email });
    if (!userRecord) return res.status(404).json({ message: "No account found with this email." });

    const isPasswordCorrect = await bcrypt.compare(password, userRecord.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect password. Give it another shot." });

    // Generate a secure token for the session
    const token = jwt.sign({ id: userRecord._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({ token, userName: userRecord.fullName });
  } catch (error) {
    res.status(500).json({ message: "Login failed. Please check your connection." });
  }
};