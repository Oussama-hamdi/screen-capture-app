const { broadcast } = require("../websockets/websocketServer");

const notifyNewScreenshot = (userId) => {
  broadcast(JSON.stringify({ type: "new_screenshot", userId }));
};

module.exports = { notifyNewScreenshot };
