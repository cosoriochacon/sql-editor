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
};
