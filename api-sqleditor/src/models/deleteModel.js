const fs = require("fs");

/**
 * Parseo de query: Delete
 * @param {*} statements
 * @returns Valores eliminados
 */
const deleteQuery = async (statements) => {
  let from = statements.from.name;
  let column = statements.where[0].left.name;
  let value = statements.where[0].right.name;
  let nameTable = from.split(".")[1].trim();
  let nameDB = from.split(".")[0].trim();
  let nameFile = nameTable + ".json";
  let path = "files/" + nameFile;
  try {
    const file_res = await appendDataToFile(path, statements);
    if (file_res.code === 200) {
      let response = {
        status: 0,
        message: `Delete table ${nameTable} on server ${nameDB} successfull`,
        table: file_res.table,
      };
      return response;
    } else if (file_res === 404) {
      let response = {
        status: 1,
        message: `The value ${value} is not in the table ${nameTable}`,
        table: {},
      };
      return response;
    } else if (file_res === 400) {
      let response = {
        status: 1,
        message: `Table ${nameTable} does not exists on the server`,
        table: {},
      };
      return response;
    } else if (file_res === 403) {
      let response = {
        status: 1,
        message: `Column ${column} does not exist in table ${nameTable}`,
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
 * Eliminar los valores correspondientes del archivo .json
 * @param {*} path Path del archivo .json
 * @param {*} statements Genero por el query
 * @returns
 */
const appendDataToFile = async (path, statements) => {
  let file = fs.existsSync(path);
  if (file) {
    const oldBuffer = await fs.promises.readFile(path);
    const oldContent = oldBuffer.toString();
    obj = JSON.parse(oldContent);
    let pos_where = obj.columns.indexOf(statements.where[0].left.name);
    if (pos_where === -1) return 403;
    let value = statements.where[0].right.name;
    let pos_data;

    for (let i = 0; i < obj.data.length; i++) {
      if (obj.data[i][pos_where] === statements.where[0].right.name) {
        pos_data = i;
      }
    }

    if (pos_data === undefined) return 404;
    let arrayTemp = [];
    for (let i = 0; i < obj.data.length; i++) {
      const element = obj.data[i][pos_where];
      if (element !== value) arrayTemp.push(obj.data[i]);
    }

    obj.data = arrayTemp;

    let json = JSON.stringify(obj);
    await fs.writeFileSync(path, json, "utf-8");

    return { code: 200, table: obj };
  } else {
    return 400;
  }
};

module.exports = {
  deleteQuery,
};
