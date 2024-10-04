//! if you use twilio please make sure to uncomment the code below

const bcrypt = require("bcryptjs");
const twilio = require("twilio");
const User = require("../models/User");

// Twilio Credentials
const accountSid = "your_account_sid";
const authToken = "your_auth_token";
const client = new twilio(accountSid, authToken);

// Signup Function
exports.signup = async (req, res) => {
  const { username, phoneNumber, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create a new user
    const user = new User({
      username,
      phoneNumber,
      password: hashedPassword,
      verificationCode,
    });

    await user.save();

    // Send verification code via Twilio
    client.messages
      .create({
        body: `Your verification code is ${verificationCode}`,
        to: phoneNumber, // The number from the form
        from: "+your_twilio_number",
      })
      .then(() => {
        res.status(200).json({
          message: "Signup successful, verification code sent",
          userId: user._id,
        });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: "Error sending verification code", error });
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Verify Function
exports.verify = async (req, res) => {
  const { userId, code } = req.body;

  try {
    const user = await User.findById(userId);

    if (user.verificationCode === code) {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({ message: "Phone number verified" });
    } else {
      return res.status(400).json({ message: "Incorrect verification code" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//! otp routes code
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const otpRouter = express.Router();
// Signup Route
otpRouter.post("/signup", usersController.signup);

// Verify Route
otpRouter.post("/verify", usersController.verify);

module.exports = otpRouter;
