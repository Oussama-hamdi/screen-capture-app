const WebSocket = require("ws");

const wss = new WebSocket.Server({ noServer: true }); // Use noServer to integrate with existing HTTP server

// Store connected clients
let clients = [];

wss.on("connection", (ws) => {
  console.log("New client connected");
  clients.push(ws);

  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client !== ws);
  });
});

// Function to broadcast messages to all connected clients
const broadcast = (message) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

module.exports = { wss, broadcast };
