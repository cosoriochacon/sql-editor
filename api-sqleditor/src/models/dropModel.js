const fs = require("fs");

/**
 * Parseo de query: Drop
 * @param {*} statements
 * @returns Tabla eliminada
 */
const dropQuery = async (statements) => {
  try {
    let target = statements.target.name;
    let nameTable = target.split(".")[1].trim();
    let nameDB = target.split(".")[0].trim();
    let nameFile = nameTable + ".json";
    let path = "files/" + nameFile;
    const file_res = await dropFile(path, nameTable);
    if (file_res.code === 200) {
      let response = {
        status: 0,
        message: `Drop table ${nameTable} on server ${nameDB} successfull`,
        table: file_res.table,
      };
      return response;
    } else if (file_res === 400) {
      let response = {
        status: 1,
        message: `Table ${nameTable} does not exists on the server`,
        table: {},
      };
      return response;
    }
  } catch (error) {
    let response = {
      status: 1,
      message: "Syntax Error",
      table: {},
    };
    return response;
  }
};

/**
 * Eliminar el archivo del sistema
 * @param {*} path Path del archivo .json
 * @param {*} statements Genero por el query
 * @returns
 */
const dropFile = async (path, nameTable) => {
  let file = fs.existsSync(path);
  if (file) {
    let newPath = "src/db/databases.json";
    const oldBuffer = await fs.promises.readFile(newPath);
    const oldContent = oldBuffer.toString();
    obj = JSON.parse(oldContent);
    if (obj.length > 0) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].name === nameTable) obj.splice(i, 1);
      }
    }
    await fs.writeFileSync(newPath, JSON.stringify(obj), "utf-8");
    fs.unlinkSync(path);
    return { code: 200, table: {} };
  } else {
    return 400;
  }
};

module.exports = {
  dropQuery,
};
