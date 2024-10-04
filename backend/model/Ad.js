const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const adSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["place", "music", "caterer"],
    required: true,
  },
  images: {
    type: [{ type: String }], // Array of strings for image paths
    required: true,
  },
  attributes: {
    type: Object,
    default: {},
    properties: {
      alcohol: {
        type: Boolean,
      },
      barrierFree: {
        type: Boolean,
      },
      parking: {
        type: Boolean,
      },
      wifi: {
        type: Boolean,
      },
      electricity: {
        type: Boolean,
      },
      toilets: {
        type: Boolean,
      },
      catering: {
        type: Boolean,
      },
      // New fields for Caterer Ads
      kitchenType: {
        type: String, // Add this for caterer ads (e.g., "vegetarian", "continental", etc.)
      },
      supportedEvents: {
        type: [String], // Add this to hold an array of supported event types
      },
      companyName: {
        type: String, // Add this for caterer ads
      },
    },
  },
  info: {
    type: Object,
    default: {},
    properties: {
      openingTime: {
        type: String,
      },
      address: {
        type: String, // Used by both music and caterer ads
      },
      capacity: {
        type: Number,
      },
      pricePerHour: {
        type: Number,
      },
      description: {
        type: String, // Used by both music and caterer ads
      },
    },
  },
  eventType: {
    type: String,
  },
  reviews: [reviewSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  menus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
