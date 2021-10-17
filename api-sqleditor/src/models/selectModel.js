const fs = require("fs");
const { get } = require("https");

/**
 * Parseo de query: Insert
 * @param {*} statements
 * @returns Valores insertados
 */
const selectQuery = async (statements) => {
  try {
    let from = statements.from.name;
    let nameTable = from.split(".")[1].trim();
    let nameDB = from.split(".")[0].trim();
    let results = statements.result;
    let nameFile = nameTable + ".json";
    let path = "files/" + nameFile;

    const file_res = await selectDataToFile(path, statements);

    if (file_res.code === 200) {
      let response = {
        status: 0,
        message: `Select table ${nameTable} on server ${nameDB} successfully`,
        table: file_res.table,
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
      message: "Error",
    };
    return response;
  }
};

/**
 * Mostar los datos del archivo
 * @param {*} path Del archivo .json
 * @param {*} data Arreglo de valores a insertar
 * @returns Archivo modificado
 */
const selectDataToFile = async (path, statements) => {
  let file = fs.existsSync(path);
  if (file) {
    const oldBuffer = await fs.promises.readFile(path);
    const oldContent = oldBuffer.toString();
    let results = statements.result;
    obj = JSON.parse(oldContent);

    let get_columns = [];
    for (let i = 0; i < results.length; i++) {
      get_columns.push(results[i].name);
    }

    /**
     * Caso 1: SELECT * FROM tabla;
     */
    if (results[0].name === "*" && statements.where === undefined) {
      return { code: 200, table: obj };
    } else if (statements.where === undefined && results[0].name !== "*") {
      /**
       * SELECT campo1, campo2 FROM tabla;
       */
      let arrayTemp = [];
      for (let i = 0; i < get_columns.length; i++) {
        for (let j = 0; j < obj.data.length; j++) {
          if (
            obj.data[j][obj.columns.indexOf(get_columns[i])].length > 0 &&
            i === 0
          ) {
            arrayTemp[j] = [];
          }
          arrayTemp[j][i] = obj.data[j][obj.columns.indexOf(get_columns[i])];
        }
      }

      obj.data = arrayTemp;
      obj.header.columns = get_columns.length;
      obj.columns = get_columns;
      return { code: 200, table: obj };
    } else if (statements.where !== undefined) {
      /**
       * Caso 3 y 4:
       */
      let arrayTemp = [];
      let arrayTempW = [];
      if (results[0].name === "*") get_columns = obj.columns;
      for (let i = 0; i < get_columns.length; i++) {
        for (let j = 0; j < obj.data.length; j++) {
          if (
            obj.data[j][obj.columns.indexOf(get_columns[i])].length > 0 &&
            i === 0
          ) {
            arrayTemp[j] = [];
          }
          arrayTemp[j][i] = obj.data[j][obj.columns.indexOf(get_columns[i])];
        }
      }

      obj.data = arrayTemp;
      let pos_where = statements.where[0].left.name;
      let value = statements.where[0].right.name;

      for (var i = 0; i < obj.data.length; i++) {
        if (obj.data[i][obj.columns.indexOf(pos_where)] == value) {
          arrayTempW[arrayTempW.length] = obj.data[i];
        }
      }
      obj.columns = get_columns;
      obj.header.columns = get_columns.length;
      obj.data = arrayTempW;

      return { code: 200, table: obj };
    }
  } else {
    return 400;
  }
};

module.exports = { selectQuery };
