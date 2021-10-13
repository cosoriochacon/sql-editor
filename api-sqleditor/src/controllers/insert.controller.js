const fs = require("fs");
const ParserModel = require("../models/parserModel");

class InsertController {
  async insertQuery(req, res) {
    let { query } = req.body;
    const statements = await ParserModel.queryParser(query);
    try {
      let arr_data = [];
      let into = statements.into;
      let nameTable = into.name;
      let results = statements.result[0].expression;
      let columns = statements.into.columns;
      let nameFile = nameTable + ".json";
      let path = "files/" + nameFile;

      let file = fs.existsSync(path);
      if (file) {
        fs.readFile(path, (err, data) => {
          if (err) {
            return res.json({ status: 0, msg: "Error" });
          } else {
            const data = fs.readFileSync(path, {
              encoding: "utf8",
              flag: "r",
            });
            let jsonData = JSON.parse(data);
            let numberColumns = jsonData.header.columns;

            for (let i = 0; i < results.length; i++) {
              arr_data.push(results[i].name);
            }

            if (results.length !== columns.length) {
              return res.json({
                status: 1,
                message:
                  "The length of the columns and the values is not equal",
              });
            }

            if (columns.length != numberColumns) {
              return res.json({
                status: 1,
                message:
                  "The length of the columns does not match the columns in the table",
              });
            }

            let obj = JSON.parse(data);
            obj.data.push(arr_data);
            let json = JSON.stringify(obj);

            fs.writeFileSync(path, json, "utf-8");
            return res.json({
              status: 0,
              message: `Insert into table ${nameTable} on local server successfully`,
            });
          }
        });
      } else {
        return res.json({
          status: 1,
          message: `Table ${nameTable} does not exists on the local server`,
        });
      }
    } catch (error) {
      res.json({
        status: 1,
        message: "Syntax Error",
      });
    }
  }
}

module.exports = new InsertController();
