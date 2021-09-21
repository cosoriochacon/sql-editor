const fs = require("fs");

/**
 * Parseo de query: Insert
 * @param {*} statements
 * @returns Valores insertados
 */
const insertQuery = async (statements) => {
  let arr_data = [];
  let into = statements.into.name;
  let nameTable = into.split(".")[1].trim();
  let nameDB = into.split(".")[0].trim();
  let results = statements.result[0].expression;
  for (let i = 0; i < results.length; i++) {
    arr_data.push(results[i].name);
  }
  let nameFile = nameTable + ".json";
  let path = "files/" + nameFile;
  try {
    const file_res = await appendDataToFile(path, arr_data.toString());
    if (file_res === 200) {
      let response = {
        message: `Insert into table ${nameTable} on server ${nameDB} successfully`,
      };
      return response;
    }
  } catch (error) {
    return error;
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

module.exports = {
  insertQuery,
};
