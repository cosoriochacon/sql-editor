const InsertController = require("../controllers/insert.controller");

module.exports = (app) => {
  /**
   * Insertar valores en el json de la tabla correspondiente
   */
  app.post("/api/query/insert", InsertController.insertQuery);
};
