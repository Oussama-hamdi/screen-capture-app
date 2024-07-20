const Screenshot = require("../models/screenshot");
const { notifyNewScreenshot } = require("../services/websocketService");

require("dotenv").config();

/**
 * Save a new screenshot for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.saveScreenshot = async (req, res) => {
  try {
    const { userId, image } = req.body;
    console.log("Saving screenshot for user:", userId);

    // Retrieve the screenshot limit from environment variables, default to 100 if not set
    const screenshotLimit = parseInt(process.env.SCREENSHOT_LIMIT, 10) || 100;

    // Create a new screenshot entry
    const newScreenshot = {
      image,
      timestamp: Date.now(),
    };

    // Find the user document in the database
    const user = await Screenshot.findOne({ userId });

    if (user) {
      // Check if the user has reached the screenshot limit
      if (user.screenshots.length >= screenshotLimit) {
        return res.status(400).json({
          message: "Screenshot limit reached",
        });
      }

      // Add the new screenshot to the user's document
      user.screenshots.push(newScreenshot);
      await user.save();

      // Notify WebSocket clients about the new screenshot
      notifyNewScreenshot(userId);

      return res.status(201).json({
        message: "Screenshot saved",
        data: user,
      });
    } else {
      // Create a new user document with the screenshot
      const newUser = new Screenshot({
        userId,
        screenshots: [newScreenshot],
      });
      await newUser.save();

      // Notify WebSocket clients about the new screenshot
      notifyNewScreenshot(userId);

      return res.status(201).json({
        message: "Screenshot saved",
        data: newUser,
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all screenshots for a specific user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getScreenshots = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all screenshots for the user and sort them by timestamp in descending order
    const screenshots = await Screenshot.find({ userId }).sort({
      timestamp: -1,
    });

    res.json(screenshots);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: error.message });
  }
};
