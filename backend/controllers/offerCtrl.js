const asyncHandler = require("express-async-handler");
const Offer = require("../model/Offer");
const Ad = require("../model/Ad");

const offerController = {
  //! Create Offer (Owner Side)
  createOffer: asyncHandler(async (req, res) => {
    const { adId, customerId, title, price, description, date } = req.body;
    const ownerId = req.user._id; // Assume owner is authenticated

    const ad = await Ad.findById(adId);

    if (!ad || ad.user.toString() !== ownerId.toString()) {
      res.status(400).json({
        message: "You are not authorized to create an offer for this ad",
      });
      return;
    }
    // Validate the date format (DD-MM-YY)
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
    if (!date || !dateRegex.test(date)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use DD-MM-YY" });
    }

    const offer = new Offer({
      ad: adId,
      owner: ownerId,
      customer: customerId,
      title,
      price,
      description,
      date,
    });

    await offer.save();
    res.status(201).json({ message: "Offer created successfully", offer });
  }),

  //! Fetch Offers for Customer
  getOffersForCustomer: asyncHandler(async (req, res) => {
    const offers = await Offer.find({ customer: req.user._id }).populate(
      "ad owner",
      "name username"
    );
    res.status(200).json({ offers });
  }),

  //! Fetch Single Offer
  getOffer: asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id).populate(
      "ad owner customer",
      "name username"
    );
    if (!offer) {
      res.status(404).json({ message: "Offer not found" });
      return;
    }
    res.status(200).json({ offer });
  }),

  //! Update Offer (Customer Side - Modify Offer)
  updateOffer: asyncHandler(async (req, res) => {
    const { title, price, description } = req.body;
    const offer = await Offer.findById(req.params.id);

    if (!offer || offer.customer.toString() !== req.user._id.toString()) {
      res
        .status(401)
        .json({ message: "You are not authorized to update this offer" });
      return;
    }

    offer.title = title || offer.title;
    offer.price = price || offer.price;
    offer.description = description || offer.description;
    offer.status = "modified";

    await offer.save();
    res.status(200).json({ message: "Offer updated successfully", offer });
  }),

  //! Accept or Deny Offer (Customer Side)
  respondToOffer: asyncHandler(async (req, res) => {
    const { status } = req.body; // accept or deny
    const offer = await Offer.findById(req.params.id);

    if (!offer || offer.customer.toString() !== req.user._id.toString()) {
      res
        .status(401)
        .json({ message: "You are not authorized to respond to this offer" });
      return;
    }

    if (!["accepted", "denied"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    offer.status = status;
    await offer.save();
    res.status(200).json({ message: `Offer ${status} successfully`, offer });
  }),
};

module.exports = offerController;
