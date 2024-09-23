const express = require("express");
const usersController = require("../controllers/usersCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const userRouter = express.Router();
//! Register
userRouter.post("/api/v1/users/register", usersController.register);
//! Login
userRouter.post("/api/v1/users/login", usersController.login);
//! Profile
userRouter.get(
  "/api/v1/users/profile",
  isAuthenticated,
  usersController.profile
);
//! Logout
userRouter.post("/api/v1/users/logout", usersController.logout);
//! change password
userRouter.put(
  "/api/v1/users/change-password",
  isAuthenticated,
  usersController.changeUserPassword
);
//! change user Profile
userRouter.put(
  "/api/v1/users/update-profile",
  isAuthenticated,
  usersController.updateUserProfile
);

//! upload profile pic
userRouter.put(
  "/api/v1/users/upload-profile-pic",
  isAuthenticated,
  usersController.uploadProfilePic
);

//! fetch profile pic
userRouter.get(
  "/api/v1/users/fetch-profile-pic",
  isAuthenticated,
  usersController.fetchProfilePic
);

//! update mobile number
userRouter.put(
  "/api/v1/users/update-mobile-number",
  isAuthenticated,
  usersController.updateMobileNo
);

//! Delete user account
userRouter.delete(
  "/api/v1/users/delete-account",
  isAuthenticated,
  usersController.deleteUser
);

//! Check Auth
userRouter.get(
  "/api/v1/users/check-auth",
  isAuthenticated,
  usersController.checkAuth
);

module.exports = userRouter;
