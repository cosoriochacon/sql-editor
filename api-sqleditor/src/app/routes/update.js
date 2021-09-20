const fs = require("fs");
const FileModel = require("../models/file");

module.exports = (app) => {
  app.post("/api/query/update", async (req, res) => {
    let { query } = req.body;
    const statements = await FileModel.queryParser(query);
    let into = statements.into.name;
    let nameTable = into.split(".")[1].trim();
    let nameDB = into.split(".")[0].trim();
    let nameFile = nameTable + ".json";
    let path = "files/" + nameFile;
    let file = fs.existsSync(path);
    if (file) {
      fs.readFile(path, (err, data) => {
        if (err) {
          res.json({ status: 0, msg: "Error" });
        } else {
          obj = JSON.parse(data);
          let pos_where = obj.columns.indexOf(statements.where[0].left.name);
          let pos_data;
          for (let i = 0; i < obj.data.length; i++) {
            if (obj.data[i][pos_where] === statements.where[0].right.name) {
              pos_data = i;
            }
          }
          let dataTemp = obj.data[pos_data];
          let columns_modify = [];
          let data_modify = [];
          for (let i = 0; i < statements.set.length; i++) {
            columns_modify.push(statements.set[i].target.name);
            data_modify.push(statements.set[i].value.name);
          }

          let cont = 0;
          for (let i = 0; i < obj.columns.length; i++) {
            if (i === pos_where) {
              dataTemp[i] = dataTemp[i];
            } else {
              dataTemp[i] = data_modify[cont];
              cont++;
            }
          }

          obj.data[pos_data] = dataTemp;

          let json = JSON.stringify(obj);
          fs.writeFileSync(path, json, "utf-8");
          res.json({
            status: 1,
            msg: `Update table ${nameTable} on server ${nameDB} successfull`,
          });
        }
      });
    }
  });
};
