const WebSocket = require("ws");

// Create a WebSocket server instance, integrating it with an existing HTTP server
const wss = new WebSocket.Server({ noServer: true });

// Array to keep track of connected clients
let clients = [];

// Event handler for when a new client connects
wss.on("connection", (ws) => {
  console.log("New client connected");
  clients.push(ws);

  // Event handler for receiving messages from clients
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });

  // Event handler for when a client disconnects
  ws.on("close", () => {
    console.log("Client disconnected");
    // Remove the disconnected client from the list
    clients = clients.filter((client) => client !== ws);
  });
});

// Function to broadcast a message to all connected clients
const broadcast = (message) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Export the WebSocket server instance and broadcast function
module.exports = { wss, broadcast };
