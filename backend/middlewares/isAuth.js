// const asyncHandler = require("express-async-handler");
// const jwt = require("jsonwebtoken");
// const User = require("../model/User");
// //! IsAuthenticated middleware
// const isAuthenticated = asyncHandler(async (req, res, next) => {
//   if (req.cookies.token) {
//     //! verify the token
//     const decoded = jwt.verify(req.cookies.token, "mySecretKey");
//     // the actual login user
//     // add the user to the req obj
//     // req.user = await User.findById(decoded?.id).select("-password");
//     req.user = decoded.id;
//     next();
//   } else {
//     // return res.status(401).json({ message: "Not Authorized, No Token" });
//     const err = new Error("Token expired, login again");
//     next(err);
//   }
// });

// module.exports = isAuthenticated;

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

//! IsAuthenticated middleware
const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    //! verify the token
    const decoded = jwt.verify(req.cookies.token, "mySecretKey");
    // Fetch the actual user from the database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      const err = new Error("User not found");
      next(err);
    }
    // Add the user to the req object
    req.user = user;
    next();
  } else {
    const err = new Error("Token expired, login again");
    next(err);
  }
});

module.exports = isAuthenticated;
