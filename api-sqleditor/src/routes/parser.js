const ParserModel = require("../models/parserModel");
const CreateModel = require("../models/createModel");
const InsertModel = require("../models/insertModel");
const UpdateModel = require("../models/updateModel");
const DeleteModel = require("../models/deleteModel");
const dotenv = require("dotenv").config();

module.exports = (app) => {
  app.post("/parseQuery", async (req, res) => {
    const { query } = req.body;
    const statements = await ParserModel.parseQuery(query);
    let response;
    switch (statements.variant) {
      case "create":
        response = await CreateModel.createQuery(statements);
        response && res.json(response);
        break;
      case "insert":
        response = await InsertModel.insertQuery(statements);
        response && res.json(response);
        break;
      case "update":
        response = await UpdateModel.updateQuery(statements);
        response && res.json(response);
        break;
      case "delete":
        response = await DeleteModel.deleteQuery(statements);
        response && res.json(response);
        break;
      default:
        let errorResponse = {
          status: 1,
          message: "Syntax error",
        };
        res.json(errorResponse);
        break;
    }
  });
};
