const path = require("path");
const DB_PATH = path.join(__dirname + "/../db/servers.json");
let db = require(DB_PATH);
const fs = require("fs");
module.exports = (app) => {
  app.get("/api/schemas", (req, res) => {
    res.json(db);
  });
};
