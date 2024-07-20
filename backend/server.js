// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const screenshotRoutes = require("./routes/screenshotRoutes");
const { wss } = require("./websockets/websocketServer");

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Define the port for the server
const PORT = process.env.PORT || 3499;

// Connect to the MongoDB database
connectDB();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Set up API routes
app.use("/api", screenshotRoutes);

// Create an HTTP server using the Express application
const server = http.createServer(app);

// Integrate the WebSocket server with the HTTP server
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Start the server and listen on the defined port
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
