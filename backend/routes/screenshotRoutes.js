const express = require("express");
const router = express.Router();
const {
  saveScreenshot,
  getScreenshots,
} = require("../controllers/screenshotController");

router.post("/screenshots", saveScreenshot);
router.get("/screenshots/:userId", getScreenshots);

module.exports = router;
