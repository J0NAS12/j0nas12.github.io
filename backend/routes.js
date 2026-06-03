const path = require("path");
const express = require("express");

function setupRoutes(app) {
  // serve Angular build
  app.use(express.static(path.join(__dirname, "../dist/browser")));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../dist/browser/index.html"));
  });
}

module.exports = setupRoutes;
