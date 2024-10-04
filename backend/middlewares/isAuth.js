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

// const asyncHandler = require("express-async-handler");
// const jwt = require("jsonwebtoken");
// const User = require("../model/User");

// //! IsAuthenticated middleware
// const isAuthenticated = asyncHandler(async (req, res, next) => {
//   if (req.cookies.token) {
//     //! verify the token
//     const decoded = jwt.verify(req.cookies.token, "mySecretKey");
//     // Fetch the actual user from the database
//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) {
//       const err = new Error("User not found");
//       next(err);
//     }
//     // Add the user to the req object
//     req.user = user;
//     next();
//   } else {
//     const err = new Error("Token expired, login again");
//     next(err);
//   }
// });

// module.exports = isAuthenticated;

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided. Please log in." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mySecretKey");

    // Fetch the user from the database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    return res
      .status(401)
      .json({ message: "Invalid token. Authentication failed." });
  }
});

module.exports = isAuthenticated;
