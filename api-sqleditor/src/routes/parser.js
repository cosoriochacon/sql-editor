const ParserController = require("../controllers/parser.controller");

module.exports = (app) => {
  app.post("/parseQuery", ParserController.parser);
  app.get("/api/logs", ParserController.getLogs);
  app.post("/api/logs", ParserController.addLog);
  app.get("/api/databases", ParserController.getDatabases);
};
