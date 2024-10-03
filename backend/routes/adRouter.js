const express = require("express");
const adsController = require("../controllers/adsCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const adRouter = express.Router();

//! Create Ad
adRouter.post("/api/v1/ads/create", isAuthenticated, adsController.createAd);
//! Create Ad music
adRouter.post(
  "/api/v1/ads/create-music-ad",
  isAuthenticated,
  adsController.createMusicAd
);
//! Create Ad caterer
adRouter.post(
  "/api/v1/ads/create-caterer-ad",
  isAuthenticated,
  adsController.createCatererAd
);
//! Fetch All Ads
adRouter.get("/api/v1/ads", isAuthenticated, adsController.getAllAds);
//! Fetch Single Ad
adRouter.get("/api/v1/ads/:id", isAuthenticated, adsController.getSingleAd);
//! Update Ad
adRouter.put("/api/v1/ads/:id", isAuthenticated, adsController.updateAd);
//! Delete Ad
adRouter.delete("/api/v1/ads/:id", isAuthenticated, adsController.deleteAd);
//! Add Review
adRouter.post(
  "/api/v1/ads/:id/review",
  isAuthenticated,
  adsController.addReview
);

module.exports = adRouter;
