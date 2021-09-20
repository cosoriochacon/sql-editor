const fs = require("fs");
const FileModel = require("../models/file");

module.exports = (app) => {
  /**
   * Insertar valores en el json de la tabla correspondiente
   */
  app.post("/api/query/insert", async (req, res) => {
    let { query } = req.body;
    const statements = await FileModel.queryParser(query);
    let arr_data = [];
    let into = statements.into.name;
    let nameTable = into.split(".")[1].trim();
    let nameDB = into.split(".")[0].trim();
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
          res.json({
            status: 1,
            msg: `Insert into table ${nameTable} on server ${nameDB} successfully`,
          });
        }
      });
    }
  });
};
