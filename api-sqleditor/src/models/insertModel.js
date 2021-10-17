const fs = require("fs");

/**
 * Parseo de query: Insert
 * @param {*} statements
 * @returns Valores insertados
 */
const insertQuery = async (statements) => {
  try {
    let arr_data = [];
    let into = statements.into.name;
    let nameTable = into.split(".")[1].trim();
    let nameDB = into.split(".")[0].trim();
    let results = statements.result[0].expression;
    let columns = statements.into.columns;
    let nameFile = nameTable + ".json";
    let path = "files/" + nameFile;

    const fileCurrent = await checkFileExists(path);
    if (!fileCurrent) {
      let response = {
        status: 1,
        message: `Table ${nameTable} does not exists on the server`,
      };
      return response;
    }

    const data = fs.readFileSync(path, { encoding: "utf8", flag: "r" });
    let jsonData = JSON.parse(data);
    let numberColumns = jsonData.header.columns;

    if (results.length !== columns.length) {
      let response = {
        status: 1,
        message: "The length of the columns and the values is not equal",
      };
      return response;
    }

    if (columns.length != numberColumns) {
      let response = {
        status: 1,
        message:
          "The length of the columns does not match the columns in the table",
      };
      return response;
    }

    for (let i = 0; i < numberColumns; i++) {
      try {
        arr_data.push(results[i].name);
      } catch (error) {
        arr_data.push(null);
      }
    }
    const file_res = await appendDataToFile(path, arr_data.toString());
    if (file_res === 200) {
      let response = {
        status: 0,
        message: `Insert into table ${nameTable} on server ${nameDB} successfully`,
      };
      return response;
    }
  } catch (error) {
    let response = {
      status: 1,
      message: error,
    };
    return response;
  }
};

/**
 * Insertar valores en el archivo
 * @param {*} path Del archivo .json
 * @param {*} data Arreglo de valores a insertar
 * @returns Archivo modificado
 */
const appendDataToFile = async (path, data) => {
  let file = fs.existsSync(path);
  if (file) {
    const oldBuffer = await fs.promises.readFile(path);
    const oldContent = oldBuffer.toString();
    obj = JSON.parse(oldContent);
    obj.data.push(data.split(","));
    let json = JSON.stringify(obj);
    await fs.writeFileSync(path, json, "utf-8");
    return 200;
  }
};

/**
 * Función para validar si existe el archivo .json
 * @param {pathname} file
 * @returns Boolena
 */
async function checkFileExists(file) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

module.exports = {
  insertQuery,
};
