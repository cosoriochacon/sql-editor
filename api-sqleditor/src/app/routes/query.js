const conn = require("../../config/database");

module.exports = (app) => {
  app.get("/api/query/:id", (req, res) => {
    let query = `SELECT * FROM querys WHERE estado = 'Activo' AND iddatabase = ${req.params.id};`;
    conn.query(query, (err, rows) => {
      if (err) res.status(500).json({ status: 0, msg: "Error" });
      else {
        if (rows.length > 0) {
          res.json({ status: 1, msg: "Exitoso", data: rows });
        } else {
          res.status(404).json({ status: 0, msg: "Records not found" });
        }
      }
    });
  });

  app.post("/api/query", (req, res) => {
    let body = {
      iddb: req.body.iddb,
      query: req.body.query,
      cant: req.body.cant,
      fields: req.body.fields,
      table: req.body.table,
    };

    let query =
      "INSERT INTO querys (query, cant, fields, tableName, iddatabase) VALUES(?,?,?,?,?)";

    conn.query(
      query,
      [body.query, body.cant, body.fields, body.table, body.iddb],
      (err) => {
        if (err) res.status(500).json({ status: 0, msg: err.sqlMessage });
        else res.json({ status: 1, msg: "Table created successfully" });
      }
    );
  });
};
