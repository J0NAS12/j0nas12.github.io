const express = require("express");
const http = require("http");

const setupRoutes = require("./routes");
const setupWebSocket = require("./websocket-server");

const app = express();
const server = http.createServer(app);

// attach HTTP routes
setupRoutes(app);

// attach WebSocket
setupWebSocket(server);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
