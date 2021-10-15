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
    const file_res = await dropFile(path);
    if (file_res === 200) {
      let response = {
        status: 0,
        message: `Drop table ${nameTable} on server ${nameDB} successfull`,
      };
      return response;
    } else if (file_res === 400) {
      let response = {
        status: 1,
        message: `Table ${nameTable} does not exists on the server`,
      };
      return response;
    }
  } catch (error) {
    let response = {
      status: 1,
      message: "Syntax Error",
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
const dropFile = async (path) => {
  let file = fs.existsSync(path);
  if (file) {
    fs.unlinkSync(path);
    return 200;
  } else {
    return 400;
  }
};

module.exports = {
  dropQuery,
};
