const mongoose = require("mongoose");

// Define the schema for the Screenshot model
const screenshotSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // The userId field is required
  },
  screenshots: [
    {
      image: {
        type: String,
        required: true, // The image field is required
      },
      timestamp: {
        type: Date,
        default: Date.now, // Default to the current date and time
      },
    },
  ],
});

// Create the model based on the schema
const Screenshot = mongoose.model("Screenshot", screenshotSchema);

module.exports = Screenshot;
