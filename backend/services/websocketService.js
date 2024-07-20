// Import the broadcast function from the WebSocket server module
const { broadcast } = require("../websockets/websocketServer");

/**
 * Notify all connected clients about a new screenshot.
 *
 * @param {string} userId - The ID of the user who has a new screenshot.
 */
const notifyNewScreenshot = (userId) => {
  // Create a notification message with the type and user ID
  const message = JSON.stringify({ type: "new_screenshot", userId });

  // Broadcast the message to all connected clients
  broadcast(message);
};

// Export the notifyNewScreenshot function for use in other modules
module.exports = { notifyNewScreenshot };
