const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const otpRouter = express.Router();
// Signup Route
otpRouter.post("/signup", usersController.signup);

// Verify Route
otpRouter.post("/verify", usersController.verify);

module.exports = otpRouter;
