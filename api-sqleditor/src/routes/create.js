const fs = require("fs");
const ParserModel = require("../models/parserModel");

module.exports = (app) => {
  /**
   * Crear el archivo .json con el nombre de la tabla
   */
  app.post("/api/query/create", async (req, res) => {
    const { query } = req.body;
    const statements = await ParserModel.queryParser(query);
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
        res.json({
          status: 1,
          msg: `Table ${nameTable} created on server ${nameDB}`,
        });
      }
    });
  });
};
