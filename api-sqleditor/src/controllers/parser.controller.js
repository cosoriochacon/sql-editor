const path = require("path");
const DB_PATH = path.join(__dirname + "/../db/logs.json");
let db = require(DB_PATH);
const fs = require("fs");
const moment = require("moment");

const ParserModel = require("../models/parserModel");
const CreateModel = require("../models/createModel");
const InsertModel = require("../models/insertModel");
const UpdateModel = require("../models/updateModel");
const DeleteModel = require("../models/deleteModel");
const DropModel = require("../models/dropModel");
const SelectModel = require("../models/selectModel");

class UserController {
  async parser(req, res) {
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
      case "select":
        response = await SelectModel.selectQuery(statements);
        response && res.json(response);
        break;
      case "drop":
        response = await DropModel.dropQuery(statements);
        response && res.json(response);
        break;
      default:
        let errorResponse = {
          status: 1,
          message: "Syntax error",
          table: {},
        };
        res.json(errorResponse);
        break;
    }
  }

  async getLogs(req, res) {
    let array = [];
    for (let i = db.length - 1; i >= 0; i--) {
      if (db[i].created_at === moment().format("LL")) {
        await array.push(db[i]);
      }
    }
    return await res.json(array);
  }

  async addLog(req, res) {
    const body = req.body;
    let message;
    let firstId = 1;
    if (db.length === 0) {
      message = {
        id: firstId,
        status: body.status,
        message: body.message,
        date: moment().format("LLL"),
        created_at: moment().format("LL"),
      };
    } else {
      const lastMessage = db[db.length - 1];
      const { id } = lastMessage;
      let nextId = id + 1;
      message = {
        id: nextId,
        status: body.status,
        message: body.message,
        date: moment().format("LLL"),
        created_at: moment().format("LL"),
      };
    }
    db.push(message);
    fs.writeFileSync(DB_PATH, JSON.stringify(db));
    return res.json({ message: "OK log" });
  }
}

module.exports = new UserController();
