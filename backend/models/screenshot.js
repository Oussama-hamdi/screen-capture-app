const mongoose = require("mongoose");

// Define the schema for the Screenshot model
const screenshotSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  screenshots: [
    {
      image: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Create the model based on the schema
const Screenshot = mongoose.model("Screenshot", screenshotSchema);

module.exports = Screenshot;
