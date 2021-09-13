const fs = require("fs");
const sqliteParser = require("sqlite-parser");
const FileModel = require("../models/file");

module.exports = (app) => {
  app.post("/api/file", (req, res) => {
    let name = req.body.namedb + ".txt";
    let text = req.body.text;
    let path = "files/" + name;
    fs.appendFile(path, text + "\n", (error) => {
      if (error) {
        throw error;
      } else {
        res.json({ status: 1, msg: "File created successfully" });
      }
    });
  });

  /**
   * Crear el archivo .json con el nombre de la tabla
   */
  app.post("/api/file/create", async (req, res) => {
    const { query } = req.body;
    const statements = await FileModel.queryParser(query);
    let columns = [];
    let into = statements.name.name;
    let nameTable = into.split(".")[1].trim();
    let nameDB = into.split(".")[0].trim();
    let arr_columns = statements.definition;
    for (let i = 0; i < arr_columns.length; i++) {
      columns.push(arr_columns[i].name);
    }
    let name = nameTable + ".json";
    let path = "files/" + name;
    let newIItem = {
      header: {
        tb_name: nameTable,
        db_name: nameDB,
      },
      columns: columns,
      data: [],
    };
    const json = JSON.stringify(newIItem);
    fs.appendFile(path, json, (error) => {
      if (error) {
        throw error;
      } else {
        res.json({ status: 1, msg: "File created successfully" });
      }
    });
  });

  app.post("/api/file/write", async (req, res) => {
    let { query } = req.body;
    const statements = await FileModel.queryParser(query);
    let arr_data = [];
    let into = statements.into.name;
    let nameTable = into.split(".")[1].trim();
    let results = statements.result[0].expression;
    for (let i = 0; i < results.length; i++) {
      arr_data.push(results[i].name);
    }

    let nameFile = nameTable + ".json";
    let path = "files/" + nameFile;
    let file = fs.existsSync(path);

    if (file) {
      fs.readFile(path, (err, data) => {
        if (err) {
          res.json({ status: 0, msg: "Error" });
        } else {
          obj = JSON.parse(data);
          obj.data.push(arr_data);
          let json = JSON.stringify(obj);

          fs.writeFileSync(path, json, "utf-8");
          res.json({ status: 1, msg: "File modified successfully" });
        }
      });
    }
  });
};
