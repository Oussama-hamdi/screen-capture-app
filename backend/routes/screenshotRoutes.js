const express = require("express");
const router = express.Router();
const {
  saveScreenshot,
  getScreenshots,
} = require("../controllers/screenshotController");

// Route to save a new screenshot
router.post("/screenshots", saveScreenshot);

// Route to get screenshots for a specific user
router.get("/screenshots/:userId", getScreenshots);

module.exports = router;
