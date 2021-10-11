const fs = require("fs");

/**
 * Parseo de query: Delete
 * @param {*} statements
 * @returns Valores eliminados
 */
const deleteQuery = async (statements) => {
  let from = statements.from.name;
  let nameTable = from.split(".")[1].trim();
  let nameDB = from.split(".")[0].trim();
  let nameFile = nameTable + ".json";
  let path = "files/" + nameFile;
  try {
    const file_res = await appendDataToFile(path, statements);
    if (file_res === 200) {
      let response = {
        message: `Delete table ${nameTable} on server ${nameDB} successfull`,
      };
      return response;
    }
  } catch (error) {
    return error;
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
    let pos_data;
    for (let i = 0; i < obj.data.length; i++) {
      if (obj.data[i][pos_where] === statements.where[0].right.name) {
        pos_data = i;
      }
    }
    let dataTemp = obj.data[pos_data];

    for (let i = 0; i < dataTemp.length; i++) {
      if (dataTemp[i] === statements.where[0].right.name) {
        obj.data.splice(pos_data, 1);
      }
    }

    let json = JSON.stringify(obj);
    await fs.writeFileSync(path, json, "utf-8");

    return 200;
  }
};

module.exports = {
  deleteQuery,
};
