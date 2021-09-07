const fs = require("fs");

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
  app.post("/api/file/create", (req, res) => {
    const { nameTable, columns } = req.body;
    let name = nameTable + ".json";
    let path = "files/" + name;
    let newIItem = {
      header: {
        tb_name: nameTable,
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

  app.post("/api/file/write", (req, res) => {
    const { nameTable } = req.body;
    let nameFile = nameTable + ".json";
    let path = "files/" + nameFile;
    let file = fs.existsSync(path);

    if (file) {
      fs.readFile(path, (err, data) => {
        if (err) {
          res.json({ status: 0, msg: "Error" });
        } else {
          obj = JSON.parse(data);
          obj.data.push(req.body.data);
          let json = JSON.stringify(obj);

          fs.writeFileSync(path, json, "utf-8");
          res.json({ status: 1, msg: "File modified successfully" });
        }
      });
    }
  });
};
