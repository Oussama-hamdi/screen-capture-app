const Screenshot = require("../models/screenshot");
const { notifyNewScreenshot } = require("../services/websocketService");

require("dotenv").config();

exports.saveScreenshot = async (req, res) => {
  try {
    const { userId, image } = req.body;
    console.log("Saving screenshot", userId);
    const screenshotLimit = parseInt(process.env.SCREENSHOT_LIMIT, 10) || 100;

    // Create a new screenshot entry
    const newScreenshot = {
      image,
      timestamp: Date.now(),
    };

    // Find the user document
    const user = await Screenshot.findOne({ userId });

    if (user) {
      // Check if the user has reached the limit
      if (user.screenshots.length >= screenshotLimit) {
        return res.status(400).json({
          message: "Screenshot limit reached",
        });
      }

      // Add the new screenshot
      user.screenshots.push(newScreenshot);
      await user.save();
      // Notify WebSocket clients
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
      // Notify WebSocket clients
      notifyNewScreenshot(userId);
      return res.status(201).json({
        message: "Screenshot saved",
        data: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getScreenshots = async (req, res) => {
  try {
    const { userId } = req.params;
    const screenshots = await Screenshot.find({ userId }).sort({
      timestamp: -1,
    });
    res.json(screenshots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
