const UserController = require("../controllers/user.controller");
module.exports = (app) => {
  /**
   * Endpoint para hacer login
   */
  app.post("/api/login", UserController.login);
};
