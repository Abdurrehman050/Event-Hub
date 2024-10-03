const express = require("express");
const favoritesController = require("../controllers/favoritesCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const favoritesRouter = express.Router();

//! Add ad to favorite
favoritesRouter.post(
  "/api/v1/favorites/add/:adId",
  isAuthenticated,
  favoritesController.addFavorite
);
//! Remove ad from favorite
favoritesRouter.delete(
  "/api/v1/favorites/remove/:adId",
  isAuthenticated,
  favoritesController.removeFavorite
);

module.exports = favoritesRouter;
