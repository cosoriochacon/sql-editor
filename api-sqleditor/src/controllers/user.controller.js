const path = require("path");
const DB_PATH = path.join(__dirname + "/../db/user.json");
let db = require(DB_PATH);
const jwt = require("jsonwebtoken");
const fs = require("fs");

class UserController {
  async login(req, res) {
    const body = req.body;
    if (db.length === 0) {
      return res.status(404).json({ message: "The user does not exist" });
    } else if (db.length > 0) {
      const response = await validUser(body);
      if (Object.keys(response).length > 0) {
        let temp = { username: response.username };
        const token = jwt.sign(temp, "cc6proyectosql", {
          expiresIn: "4h",
        });
        let user = { ...temp, token };
        return res
          .status(200)
          .json({ status: 1, message: "Login successful", user });
      } else {
        return res.json({ status: 0, message: "Invalid credentials" });
      }
    }
  }
}

const validUser = async (body) => {
  for (let i = 0; i < db.length; i++) {
    if (db[i].username === body.username && db[i].password === body.password) {
      return db[i];
    }
  }
  return {};
};

module.exports = new UserController();
