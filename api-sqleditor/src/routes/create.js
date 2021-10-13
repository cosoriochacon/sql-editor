const fs = require("fs");
const ParserModel = require("../models/parserModel");

module.exports = (app) => {
  /**
   * Crear el archivo .json con el nombre de la tabla
   */
  app.post("/api/query/create", async (req, res) => {
    const { query } = req.body;
    const statements = await ParserModel.queryParser(query);
    try {
      let columns = [];
      let into = statements.name;
      let nameTable = into.name;
      let arr_columns = statements.definition;
      for (let i = 0; i < arr_columns.length; i++) {
        columns.push(arr_columns[i].name);
      }
      let name = nameTable + ".json";
      let path = "files/" + name;
      let newIItem = {
        header: {
          tb_name: nameTable,
          columns: statements.definition.length,
        },
        columns: columns,
        data: [],
      };
      const json = JSON.stringify(newIItem);

      let file = fs.existsSync(path);
      if (!file) {
        fs.appendFile(path, json, (error) => {
          if (error) {
            console.log("error1");
            throw error;
          } else {
            res.json({
              status: 0,
              msg: `Table ${nameTable} created on local server`,
            });
          }
        });
      } else {
        res.json({
          status: 1,
          msg: `Table ${nameTable} already exists on the server`,
        });
      }
    } catch (error) {
      res.json({
        status: 1,
        msg: "Syntax Error",
      });
    }
  });
};
