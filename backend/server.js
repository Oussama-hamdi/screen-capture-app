const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const screenshotRoutes = require("./routes/screenshotRoutes");
const { wss } = require("./websockets/websocketServer");

dotenv.config();

const app = express();
const PORT = 3499;

// Connect to the database
connectDB();

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api", screenshotRoutes);

// Create HTTP server
const server = http.createServer(app);

// Integrate WebSocket server with HTTP server
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
