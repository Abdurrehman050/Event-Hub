const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("path");
const Ad = require("../model/Ad");
const User = require("../model/User");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/ads_images"); // Folder where ad images will be stored
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const adsController = {
  //! Create Ad
  createAd: [
    upload.array("images", 5), // Allow up to 5 image uploads
    asyncHandler(async (req, res) => {
      const { name, type, attributes, info, eventType } = req.body;
      const user = req.user._id; // Assuming the user is authenticated and available in req.user

      // Validate the required fields
      if (!name || !type || !req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

      // Collect image paths
      const images = req.files.map((file) => `/ads_images/${file.filename}`);

      // Create the ad
      const newAd = await Ad.create({
        user,
        name,
        type,
        images,
        attributes: JSON.parse(attributes), // Convert stringified attributes to JSON
        info: JSON.parse(info), // Convert stringified info to JSON
        eventType,
      });

      // Associate the ad with the user
      const currentUser = await User.findById(user);
      currentUser.ads.push(newAd._id);
      await currentUser.save();

      res.status(201).json({
        message: "Ad created successfully",
        ad: newAd,
      });
    }),
  ],
  //! Create Music Ad
  createMusicAd: [
    upload.array("images", 5), // Allow up to 5 image uploads
    asyncHandler(async (req, res) => {
      const { name, type, info } = req.body;
      const user = req.user._id; // Assuming the user is authenticated and available in req.user

      // Validate the required fields
      if (
        !name ||
        type !== "music" ||
        !req.files ||
        req.files.length === 0 ||
        !info
      ) {
        return res.status(400).json({
          message: "Please provide all required fields for a music ad",
        });
      }

      // Collect image paths
      const images = req.files.map((file) => `/ads_images/${file.filename}`);

      // Parse the info object and extract necessary fields (address, description)
      const parsedInfo = JSON.parse(info);
      const { address, description } = parsedInfo;

      if (!address || !description) {
        return res.status(400).json({
          message: "Address and description are required for music ads",
        });
      }
      console.log(req.files); // Check if files are being passed correctly
      console.log(req.body); // Check the other fields being passed

      // Create the music ad
      const newAd = await Ad.create({
        user,
        name,
        type,
        images,
        info: { address, description }, // Store only address and description in info
      });

      // Associate the ad with the user
      const currentUser = await User.findById(user);
      currentUser.ads.push(newAd._id);
      await currentUser.save();

      res.status(201).json({
        message: "Music ad created successfully",
        ad: newAd,
      });
    }),
  ],
  //! create caterer ad
  createCatererAd: [
    upload.array("images", 5), // Allow up to 5 image uploads
    asyncHandler(async (req, res) => {
      const {
        name,
        type,
        info,
        eventType,
        kitchenType,
        companyName,
        supportedEvents,
      } = req.body;
      const user = req.user._id; // Assuming the user is authenticated and available in req.user

      // Validate the required fields
      if (
        !name ||
        type !== "caterer" ||
        !req.files ||
        req.files.length === 0 ||
        !info ||
        !supportedEvents ||
        !kitchenType ||
        !companyName
      ) {
        return res.status(400).json({
          message: "Please provide all required fields for a caterer ad",
        });
      }

      // Collect image paths
      const images = req.files.map((file) => `/ads_images/${file.filename}`);

      // Parse the info object and extract necessary fields (address, description)
      const parsedInfo = JSON.parse(info);
      const { address, description } = parsedInfo;

      if (!address || !description) {
        return res.status(400).json({
          message: "Address and description are required for caterer ads",
        });
      }
      console.log(req.body); // Check body fields
      console.log(req.files); // Check if files are being uploaded

      // Create the caterer ad
      const newAd = await Ad.create({
        user,
        name,
        type,
        images,
        info: { address, description }, // Store address and description in info
        eventType,
        attributes: {
          kitchenType,
          companyName,
          supportedEvents: JSON.parse(supportedEvents), // Convert stringified array to JSON
        },
      });

      // Associate the ad with the user
      const currentUser = await User.findById(user);
      currentUser.ads.push(newAd._id);
      await currentUser.save();

      res.status(201).json({
        message: "Caterer ad created successfully",
        ad: newAd,
      });
    }),
  ],
  //! get all ads
  getAllAds: asyncHandler(async (req, res) => {
    const ads = await Ad.find().populate("user", "username"); // Populate user info if needed
    res.status(200).json({ ads });
  }),
  //! get single ad
  getSingleAd: asyncHandler(async (req, res) => {
    const ad = await Ad.findById(req.params.id)
      .populate("user", "username")
      .populate("reviews.user", "username"); // Populate the user who gave the review

    if (!ad) {
      res.status(404);
      throw new Error("Ad not found");
    }

    res.status(200).json({ ad });
  }),

  //! update ad
  updateAd: [
    upload.array("images", 5), // Allow up to 5 image uploads
    asyncHandler(async (req, res) => {
      const ad = await Ad.findById(req.params.id);

      if (!ad) {
        res.status(404);
        throw new Error("Ad not found");
      }

      // Ensure the user owns the ad
      if (ad.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("User not authorized to update this ad");
      }

      // Collect image paths if new images are uploaded
      let images = ad.images; // Keep the existing images
      if (req.files && req.files.length > 0) {
        images = req.files.map((file) => `/ads_images/${file.filename}`); // Replace with new image paths
      }

      // Update fields from the request body
      const updatedFields = {
        name: req.body.name || ad.name,
        type: req.body.type || ad.type,
        attributes: req.body.attributes
          ? JSON.parse(req.body.attributes)
          : ad.attributes,
        info: req.body.info ? JSON.parse(req.body.info) : ad.info,
        eventType: req.body.eventType || ad.eventType,
        images: images, // Update images if new ones are provided
        updatedAt: Date.now(),
      };

      // Perform the update
      const updatedAd = await Ad.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        {
          new: true,
          runValidators: true,
        }
      );

      res
        .status(200)
        .json({ message: "Ad updated successfully", ad: updatedAd });
    }),
  ],

  //! delete ad
  deleteAd: asyncHandler(async (req, res) => {
    const adId = req.params.id;
    const ad = await Ad.findByIdAndDelete({ _id: adId });

    if (!ad) {
      res.status(404);
      throw new Error("Ad not found");
    }

    // Ensure the user owns the ad
    if (ad.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized to delete this ad");
    }

    res.status(200).json({ message: "Ad deleted successfully" });
  }),
  //! add review to ad
  addReview: asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      res.status(404);
      throw new Error("Ad not found");
    }

    const alreadyReviewed = ad.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this ad");
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };

    ad.reviews.push(review);
    await ad.save();

    res.status(201).json({ message: "Review added" });
  }),
};

module.exports = adsController;
