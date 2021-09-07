const conn = require("../../config/database");

module.exports = (app) => {
  app.get("/api/database", (req, res) => {
    let query = "SELECT * FROM DBS WHERE estado = 'Activo';";
    conn.query(query, (err, rows) => {
      if (err) res.status(500).json({ status: 0, msg: "Error" });
      else
        res.json({
          status: 1,
          msg: "Successful",
          data: rows,
        });
    });
  });

  app.get("/api/database/querys", (req, res) => {
    let query =
      "SELECT d.iddatabase, d.nombreDB, d.estado, q.tableName, q.query, q.idquery FROM DBS d inner join querys q on(d.iddatabase = q.iddatabase) WHERE d.estado = 'Activo';";
    conn.query(query, (err, rows) => {
      if (err) res.status(500).json({ status: 0, msg: "Error" });
      else {
        let name = null;
        let order_response = {};

        rows.map((item) => {
          if (name === item.nombreDB) {
            order_response[name].push(item);
          } else {
            order_response[item.nombreDB] = [];
            order_response[item.nombreDB].push(item);
            name = item.nombreDB;
          }
        });

        let array_response = [];

        for (var i in order_response)
          array_response.push([i, order_response[i]]);

        res.json({
          status: 1,
          msg: "Successful",
          data: array_response,
        });
      }
    });
  });
};
