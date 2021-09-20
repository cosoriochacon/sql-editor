const fs = require("fs");
const FileModel = require("../models/file");

module.exports = (app) => {
  app.post("/api/query/delete", async (req, res) => {
    let { query } = req.body;
    const statements = await FileModel.queryParser(query);
    let from = statements.from.name;
    let nameTable = from.split(".")[1].trim();
    let nameDB = from.split(".")[0].trim();
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

          for (let i = 0; i < dataTemp.length; i++) {
            if (dataTemp[i] === statements.where[0].right.name) {
              obj.data.splice(pos_data, 1);
            }
          }

          let json = JSON.stringify(obj);
          fs.writeFileSync(path, json, "utf-8");
          res.json({
            status: 1,
            msg: `Delete table ${nameTable} on server ${nameDB} successfull`,
          });
        }
      });
    }
  });
};
