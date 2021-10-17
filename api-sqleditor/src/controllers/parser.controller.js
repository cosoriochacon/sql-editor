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
        await addLog(response);
        break;
      case "insert":
        response = await InsertModel.insertQuery(statements);
        response && res.json(response);
        await addLog(response);
        break;
      case "update":
        response = await UpdateModel.updateQuery(statements);
        response && res.json(response);
        await addLog(response);
        break;
      case "delete":
        response = await DeleteModel.deleteQuery(statements);
        response && res.json(response);
        await addLog(response);
        break;
      case "select":
        response = await SelectModel.selectQuery(statements);
        response && res.json(response);
        await addLog(response);
        break;
      case "drop":
        response = await DropModel.dropQuery(statements);
        response && res.json(response);
        await addLog(response);
        break;
      default:
        let errorResponse = {
          status: 1,
          message: "Syntax error",
          table: {},
        };
        res.json(errorResponse);
        await addLog(errorResponse);
        break;
    }
  }

  async getLogs(req, res) {
    let array = [];
    for (let i = db.length - 1; i >= 0; i--) {
      if (db[i].created_at === moment().format("LL")) array.push(db[i]);
    }
    return res.json(array);
  }
}

const addLog = async (res) => {
  let message;
  let firstId = 1;
  if (db.length === 0) {
    message = {
      id: firstId,
      status: res.status,
      message: res.message,
      date: moment().format("LLL"),
      created_at: moment().format("LL"),
    };
  } else {
    const lastMessage = db[db.length - 1];
    const { id } = lastMessage;
    let nextId = id + 1;
    message = {
      id: nextId,
      status: res.status,
      message: res.message,
      date: moment().format("LLL"),
      created_at: moment().format("LL"),
    };
  }
  db.push(message);
  fs.writeFileSync(DB_PATH, JSON.stringify(db));
};

module.exports = new UserController();
