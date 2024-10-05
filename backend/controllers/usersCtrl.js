const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//const twilio = require("twilio");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../model/User");
const Ad = require("../model/Ad");

//! Twilio Credentials

// Twilio Credentials
// const accountSid = "your_account_sid"; // get it from twilio account
// const authToken = "your_auth_token"; // get it from twilio account
// const client = new twilio(accountSid, authToken);
//! Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/profile_pics"); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

//! User Registration

const usersController = {
  //! Register
  register: asyncHandler(async (req, res) => {
    const { username, password, mobile_number } = req.body;
    //! Validate
    if ((!username || !mobile_number, !password)) {
      throw new Error("Please all fields are required");
    }
    //! Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      throw new Error("User Already Exist");
    }
    //! Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //! Create the user and save into DB
    const userCreated = await User.create({
      mobile_number,
      username,
      password: hashedPassword,
    });
    res.json({
      message: "User Registered",
      username: userCreated.username,
      mobile_number: userCreated.mobile_number,
      id: userCreated._id,
    });
  }),
  //! Login
  login: asyncHandler(async (req, res) => {
    //! get the user data
    const { username, password } = req.body;
    //! if email is correct
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid Login Credentials");
    }
    //! Compare the user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }
    //! Generate a token
    const token = jwt.sign({ id: user._id }, "mySecretKey", {
      expiresIn: "30d",
    });
    //! set token inside cookie
    res.cookie("token", token, {
      httpOnly: true,
      //secure: this is for production ,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    //! Send the response
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      mobile_number: user.mobile_number,
      username: user.username,
    });
  }),
  //! please uncomment this code to use twilio
  //? Login with Twilio
  // login: asyncHandler(async (req, res) => {
  //   //! get the user data
  //   const { username, password } = req.body;

  //   //! if username is correct
  //   const user = await User.findOne({ username });
  //   if (!user) {
  //     throw new Error("Invalid Login Credentials");
  //   }

  //   //! Compare the user password
  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) {
  //     throw new Error("Invalid login credentials");
  //   }

  //   //! Generate verification code
  //   const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  //   //! Save the verification code to the user
  //   user.verificationCode = verificationCode;
  //   await user.save();

  //   //! Send verification code via Twilio
  //   client.messages
  //     .create({
  //       body: `Your login verification code is ${verificationCode}`,
  //       to: user.mobile_number, // User's phone number from the database
  //       from: "+your_twilio_number", // Twilio number (buy it from twilio)
  //     })
  //     .then(() => {
  //       res.status(200).json({
  //         message: "Login success. Verification code sent to your phone",
  //         id: user._id,
  //         username: user.username,
  //         mobile_number: user.mobile_number,
  //       });
  //     })
  //     .catch((error) => {
  //       res.status(500).json({
  //         message: "Error sending verification code",
  //         error,
  //       });
  //     });
  // }),

  //? Signup with Twilio
  // signup: asyncHandler(async (req, res) => {
  //   const { username, mobile_number, password } = req.body;

  //   //! Check if user already exists
  //   const userExists = await User.findOne({ mobile_number });
  //   if (userExists) {
  //     return res.status(400).json({ message: "User already exists" });
  //   }

  //   //! Hash the password
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   //! Generate verification code
  //   const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  //   //! Create a new user with verification code
  //   const newUser = new User({
  //     username,
  //     mobile_number,
  //     password: hashedPassword,
  //     verificationCode,
  //   });

  //   await newUser.save();

  //   //! Send verification code via Twilio
  //   client.messages
  //     .create({
  //       body: `Your verification code is ${verificationCode}`,
  //       to: mobile_number, // The mobile number from the form
  //       from: "+your_twilio_number", // Your Twilio number
  //     })
  //     .then(() => {
  //       res.status(200).json({
  //         message: "Signup successful. Verification code sent to your phone.",
  //         id: newUser._id,
  //         mobile_number: newUser.mobile_number,
  //       });
  //     })
  //     .catch((error) => {
  //       res.status(500).json({
  //         message: "Error sending verification code",
  //         error,
  //       });
  //     });
  // }),
  //? Verify Phone Number
  // verify: asyncHandler(async (req, res) => {
  //   const { id, code } = req.body;

  //   //! Find the user by ID
  //   const user = await User.findById(id);

  //   if (!user) {
  //     return res.status(404).json({ message: "User not found" });
  //   }

  //   //! Check if the verification code matches
  //   if (user.verificationCode === code) {
  //     user.isVerified = true;
  //     await user.save();

  //     //! Generate a token after successful verification
  //     const token = jwt.sign({ id: user._id }, "mySecretKey", {
  //       expiresIn: "30d",
  //     });

  //     //! Set token in cookie
  //     res.cookie("token", token, {
  //       httpOnly: true,
  //       sameSite: "strict",
  //       maxAge: 24 * 60 * 60 * 1000, // 1 day
  //     });

  //     res.status(200).json({
  //       message: "Phone number verified. Login successful.",
  //       token,
  //       id: user._id,
  //       username: user.username,
  //       mobile_number: user.mobile_number,
  //     });
  //   } else {
  //     return res.status(400).json({ message: "Incorrect verification code" });
  //   }
  // }),

  //! Profile
  profile: asyncHandler(async (req, res) => {
    //! Find the user
    const user = await User.findById(req.user._id)
      .populate({
        path: "ads",
        select: "name type images eventType createdAt", // Fields you want to populate from Ad
      })
      .select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    //! Send the response
    res.json({ user });
  }),
  //! Logout
  logout: asyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 1 });
    res.status(200).json({ message: "Logged out successfully" });
  }),
  //! Change password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    //! compare old password with db password
    //! Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("User Not Found");
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Wrong Password");
    }
    //! Hash the new Password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    //! Re-save the user
    await user.save();
    //! send the response
    res.json({ message: "Password Changed Successfully" });
  }),
  //! Forgot Password
  forgotPassword: asyncHandler(async (req, res) => {
    const { username, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Send the response
    res.json({ message: "Password changed successfully" });
  }),

  //! Change user Profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        username,
      },
      {
        new: true,
      }
    );
    //await updatedUser.save();
    res.json({ message: "User Profile Updated Successfully", updatedUser });
  }),
  //! Upload profile picture
  uploadProfilePic: [
    upload.single("profileImage"),
    asyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error("User not found");
      }
      user.profileImage = `/profile_pics/${req.file.filename}`;
      await user.save();
      res.json({
        message: "Profile picture uploaded successfully",
        profileImage: user.profileImage,
      });
    }),
  ],
  //! Fetch profile picture
  fetchProfilePic: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user || !user.profileImage) {
      throw new Error("Profile picture not found");
    }
    res.sendFile(path.join(__dirname, "..", "public", user.profileImage));
  }),
  //! Update Mobile Number
  updateMobileNo: asyncHandler(async (req, res) => {
    const { mobileNo } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("User Not Found");
    }
    user.mobileNo = mobileNo;
    //! Re-save the user
    await user.save();
    res.json({ message: "Mobile Number Updated Successfully" });
  }),

  //! Delete User and their Orders
  deleteUser: asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
      // Find the user to get the profile image path
      const user = await User.findById(userId);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      // Delete the user's profile image
      if (user.profileImage) {
        const profileImagePath = path.join(
          __dirname,
          "../public",
          user.profileImage
        );
        fs.unlink(profileImagePath, (err) => {
          if (err) {
            console.error(
              `Failed to delete profile image: ${profileImagePath}`,
              err
            );
          }
        });
      }

      // Delete the user
      await User.findByIdAndDelete(userId);

      res.json({ message: "User and associated orders deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }),
  //! Check Auth
  checkAuth: asyncHandler(async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, "mySecretKey");
    //console.log(decoded);
    if (decoded) {
      res.json({
        isAuthenticated: true,
      });
    } else {
      res.json({ isAuthenticated: false });
    }
  }),
};

module.exports = usersController;
