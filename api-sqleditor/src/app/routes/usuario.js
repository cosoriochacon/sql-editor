const conn = require("../../config/database");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  /**
   * Endpoint para hacer login
   */
  app.post("/api/login", (req, res) => {
    let usuario = {
      username: req.body.username,
      password: req.body.password,
    };
    let query = `SELECT idusuario, nombre, usuario, password 
                FROM usuario WHERE usuario = ? AND password = ? AND estado = 'Activo';`;
    conn.query(query, [usuario.username, usuario.password], (err, rows) => {
      if (err) res.status(500).json({ status: 0, msg: "Error" });
      else {
        if (rows.length > 0) {
          if (
            rows[0].password === usuario.password &&
            rows[0].usuario === usuario.username
          ) {
            let temp = {
              idusuario: rows[0].idusuario,
              nombre: rows[0].nombre,
              apellidos: rows[0].apellidos,
              username: rows[0].usuario,
            };

            let token = jwt.sign(temp, "barcelona", {
              expiresIn: "1h",
            });

            let user = {
              idusuario: rows[0].idusuario,
              nombre: rows[0].nombre,
              apellidos: rows[0].apellidos,
              username: rows[0].usuario,
              token: token,
            };
            res.json({
              status: 1,
              msg: "Login",
              data: user,
            });
          }
        } else {
          res.json({ status: 0, msg: "The data does not match" });
        }
      }
    });
  });
};
