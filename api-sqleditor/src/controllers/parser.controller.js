const path = require("path");
const DB_PATH = path.join(__dirname + "/../db/logs.json");
const TABLES_PATH = path.join(__dirname + "/../db/tables.json");
const LOG_PATH = path.join(__dirname + "/../../files/logs.json");
let db = require(DB_PATH);
let db2 = require(TABLES_PATH);
let logs = require(LOG_PATH);
const fs = require("fs");
const moment = require("moment");

const ParserModel = require("../models/parserModel");
const CreateModel = require("../models/createModel");
const InsertModel = require("../models/insertModel");
const UpdateModel = require("../models/updateModel");
const DeleteModel = require("../models/deleteModel");
const DropModel = require("../models/dropModel");
const SelectModel = require("../models/selectModel");
const JoinModel = require("../models/joinModel");

class UserController {
  async parser(req, res) {
    const { query, origin } = req.body;
    const statements = await ParserModel.parseQuery(query);
    let response;
    switch (statements.variant) {
      case "create":
        response = await CreateModel.createQuery(statements);
        response && res.json(response);
        await addTable(response);
        await insertLog(response, query, origin);
        break;
      case "insert":
        response = await InsertModel.insertQuery(statements);
        response && res.json(response);
        await insertLog(response, query, origin);
        break;
      case "update":
        response = await UpdateModel.updateQuery(statements);
        response && res.json(response);
        await insertLog(response, query, origin);
        break;
      case "delete":
        response = await DeleteModel.deleteQuery(statements);
        response && res.json(response);
        await insertLog(response, query, origin);
        break;
      case "select":
        if (statements.from.variant === "join") {
          response = await JoinModel.joinQuery(statements);
          response && res.json(response);
          await insertLog(response, query, origin);
        } else {
          response = await SelectModel.selectQuery(statements);
          response && res.json(response);
          await insertLog(response, query, origin);
        }
        break;
      case "drop":
        response = await DropModel.dropQuery(statements);
        response && res.json(response);
        await deleteTable(response);
        await insertLog(response, query, origin);
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

  async getDatabases(req, res) {
    let array = [];
    for (let i = db2.length - 1; i >= 0; i--) {
      await array.push(db2[i]);
    }
    return await res.json(array);
  }
}

const addTable = async (response) => {
  if (response.status === 0) {
    let newIItem = {
      name: response.table.header.tb_name,
      columns: response.table.columns,
    };
    db2.push(newIItem);
    fs.writeFileSync(TABLES_PATH, JSON.stringify(db2));
  }
};

const deleteTable = async (res) => {
  if (res.status === 0) {
    if (db2.length > 0) {
      for (let i = 0; i < db2.length; i++) {
        if (db2[i].name === res.table.header.tb_name) db2.splice(i, 1);
      }
      await fs.writeFileSync(TABLES_PATH, JSON.stringify(db2), "utf-8");
    }
  }
};

const insertLog = async (res, query, origin) => {
  let data = [query, origin, res.status, res.message, new Date()];
  logs.data.push(data);
  let json = JSON.stringify(logs);
  let path = "files/logs.json";
  await fs.writeFileSync(path, json, "utf-8");
};

module.exports = new UserController();
