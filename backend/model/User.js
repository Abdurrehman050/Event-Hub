const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNo: { type: String, required: false },
    //! in case you use twilio please make sure to uncomment the code below
    //   isVerified: {
    //     type: Boolean,
    //     default: false,
    // },
    // verificationCode: {
    //     type: String,
    //     required: false,
    // },
    profileImage: { type: String }, // URL to the profile image
    ads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ad",
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ad",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
