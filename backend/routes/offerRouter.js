const express = require("express");
const offerController = require("../controllers/offerCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const offerRouter = express.Router();

// Owner creates an offer
offerRouter.post(
  "/api/v1/offers/create",
  isAuthenticated,
  offerController.createOffer
);

// Customer fetches their offers
offerRouter.get(
  "/api/v1/offers/customer",
  isAuthenticated,
  offerController.getOffersForCustomer
);

// Fetch single offer
offerRouter.get(
  "/api/v1/offers/:id",
  isAuthenticated,
  offerController.getOffer
);

// Customer modifies an offer
offerRouter.put(
  "/api/v1/offers/update/:id",
  isAuthenticated,
  offerController.updateOffer
);

// Customer accepts or denies the offer
offerRouter.put(
  "/api/v1/offers/respond/:id",
  isAuthenticated,
  offerController.respondToOffer
);

module.exports = offerRouter;
