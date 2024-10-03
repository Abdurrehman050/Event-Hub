const asyncHandler = require("express-async-handler");
const Ad = require("../model/Ad");
const User = require("../model/User");

const favoritesController = {
  //! Add ad to favorite
  addFavorite: asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assuming user is authenticated
    const adId = req.params.adId;

    // Find the user and the ad
    const user = await User.findById(userId);
    const ad = await Ad.findById(adId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (!ad) {
      res.status(404);
      throw new Error("Ad not found");
    }

    // Check if the ad is already in favorites
    if (user.favorites.includes(adId)) {
      res.status(400);
      throw new Error("Ad is already in favorites");
    }

    // Add the ad to the user's favorites
    user.favorites.push(adId);
    await user.save();

    res
      .status(200)
      .json({ message: "Ad added to favorites", favorites: user.favorites });
  }),

  //! Remove ad from favorite
  removeFavorite: asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assuming user is authenticated
    const adId = req.params.adId;

    const user = await User.findById(userId);
    const ad = await Ad.findById(adId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (!ad) {
      res.status(404);
      throw new Error("Ad not found");
    }

    // Remove the ad from favorites
    user.favorites = user.favorites.filter((fav) => fav.toString() !== adId);
    await user.save();

    res.status(200).json({
      message: "Ad removed from favorites",
      favorites: user.favorites,
    });
  }),
};

module.exports = favoritesController;
