const express = require("express");
const http = require("http");

const setUpRoutes = require("./routes");
const setupWebSocket = require("./websocket-server");

const app = express();
const server = http.createServer(app);

// attach HTTP routes
setUpRoutes(app);

// attach WebSocket
setupWebSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
