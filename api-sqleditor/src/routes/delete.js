const DeleteController = require("../controllers/delete.controller");

module.exports = (app) => {
  app.post("/api/query/delete", DeleteController.deleteQuery);
};
