const fs = require("fs");

/**
 * Parseo del query: Create
 * @param {*} statements
 * @returns
 */
const createQuery = async (statements) => {
  let columns = [];
  let into = statements.name.name;
  let nameTable = into.split(".")[1].trim();
  let nameDB = into.split(".")[0].trim();
  let arr_columns = statements.definition;
  for (let i = 0; i < arr_columns.length; i++) {
    columns.push(arr_columns[i].name);
  }
  let name = nameTable + ".json";
  let path = "files/" + name;
  let newIItem = {
    header: {
      tb_name: nameTable,
      db_name: nameDB,
      columns: statements.definition.length,
    },
    columns: columns,
    data: [],
  };
  const json = JSON.stringify(newIItem);
  try {
    const file_res = await appendDataToFile(path, json);
    if (file_res === 200) {
      let response = {
        status: 0,
        message: `Table ${nameTable} created on server ${nameDB}`,
        table: newIItem,
      };
      return response;
    } else if (file_res === 404) {
      let response = {
        status: 1,
        message: `Table ${nameTable} already exists on the server`,
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
 * Crear el archivo .json en base al query create
 * @param {*} path Nombre y ubicación donde se guardará el archivo .json
 * @param {*} data Json con los valores
 * @returns 200 | 400
 */
const appendDataToFile = async (path, data) => {
  let file = fs.existsSync(path);
  if (!file) {
    await fs.promises.appendFile(path, data);
    const newBuffer = await fs.promises.readFile(path);
    const newContent = newBuffer.toString();
    let response;
    if (newContent.length > 0) {
      response = 200;
    } else {
      response = 400;
    }

    return response;
  } else {
    return 404;
  }
};

module.exports = {
  createQuery,
};
