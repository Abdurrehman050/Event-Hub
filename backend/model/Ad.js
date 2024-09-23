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
    // Keep this field
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
    type: [{ type: String }], // Array of strings
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
        type: String,
      },
      capacity: {
        type: Number,
      },
      pricePerHour: {
        type: Number,
      },
      description: {
        type: String,
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
