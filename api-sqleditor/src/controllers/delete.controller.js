const fs = require("fs");
const ParserModel = require("../models/parserModel");

class DeleteController {
  async deleteQuery(req, res) {
    let { query } = req.body;
    const statements = await ParserModel.queryParser(query);
    try {
      let from = statements.from;
      let column = statements.where[0].left.name;
      let value = statements.where[0].right.name;
      let nameTable = from.name;
      let nameFile = nameTable + ".json";
      let path = "files/" + nameFile;
      let file = fs.existsSync(path);
      if (file) {
        fs.readFile(path, (err, data) => {
          if (err) {
            return res.json({ status: 1, msg: "Error" });
          } else {
            let obj = JSON.parse(data);
            let pos_where = obj.columns.indexOf(statements.where[0].left.name);

            if (pos_where === -1)
              return res.json({
                status: 1,
                message: `Column ${column} does not exist in table ${nameTable}`,
              });

            let pos_data;
            for (let i = 0; i < obj.data.length; i++) {
              if (obj.data[i][pos_where] === statements.where[0].right.name) {
                pos_data = i;
              }
            }

            if (pos_data === undefined)
              return res.json({
                status: 1,
                message: `The value ${value} is not in the table ${nameTable}`,
              });

            let arrayTemp = [];
            for (let i = 0; i < obj.data.length; i++) {
              const element = obj.data[i][pos_where];
              if (element !== value) arrayTemp.push(obj.data[i]);
            }

            obj.data = arrayTemp;

            let json = JSON.stringify(obj);
            fs.writeFileSync(path, json, "utf-8");
            return res.json({
              status: 1,
              message: `Delete table ${nameTable} on local server successfull`,
            });
          }
        });
      } else {
        return res.json({
          status: 1,
          message: `Table ${nameTable} does not exists on the server`,
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

module.exports = new DeleteController();
