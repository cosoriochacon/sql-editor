const fs = require("fs");

/**
 * Parseo de query: Update
 * @param {*} statements
 * @returns Valores editados
 */
const updateQuery = async (statements) => {
  let into = statements.into.name;
  let nameTable = into.split(".")[1].trim();
  let nameDB = into.split(".")[0].trim();
  let nameFile = nameTable + ".json";
  let path = "files/" + nameFile;
  try {
    const file_res = await appendDataToFile(path, statements);
    if (file_res === 200) {
      let response = {
        message: `Update table ${nameTable} on server ${nameDB} successfull`,
      };
      return response;
    }
  } catch (error) {
    return error;
  }
};

/**
 * Editir valores del archivo .json
 * @param {*} path Del archivo .json
 * @param {*} statements
 * @returns Archivo editado
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
    let columns_modify = [];
    let data_modify = [];
    for (let i = 0; i < statements.set.length; i++) {
      columns_modify.push(statements.set[i].target.name);
      data_modify.push(statements.set[i].value.name);
    }

    let cont = 0;
    for (let i = 0; i < obj.columns.length; i++) {
      if (i === pos_where) {
        dataTemp[i] = dataTemp[i];
      } else {
        dataTemp[i] = data_modify[cont];
        cont++;
      }
    }

    obj.data[pos_data] = dataTemp;

    let json = JSON.stringify(obj);
    await fs.writeFileSync(path, json, "utf-8");

    return 200;
  }
};

module.exports = {
  updateQuery,
};
