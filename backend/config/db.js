const mongoose = require("mongoose");

/**
 * Connect to the MongoDB database.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection URI from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    // Log the error and exit the process if the connection fails
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
