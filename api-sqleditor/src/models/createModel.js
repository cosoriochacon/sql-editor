const fs = require("fs");

/**
 * Parseo del query: Create
 * @param {*} statements
 * @returns
 */
const createQuery = async (statements) => {
  try {
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
    const file_res = await appendDataToFile(path, json);
    if (file_res === 200) {
      let response = {
        status: 0,
        message: `Table ${nameTable} created on server ${nameDB}`,
        table: newIItem,
      };
      return response;
    } else if (file_res.code === 404) {
      let response = {
        status: 1,
        message: `Table ${nameTable} already exists on the server`,
        table: file_res.table,
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
    let newPath = "src/db/databases.json";
    let dataJson = JSON.parse(data);
    let newColumns = dataJson.columns;
    let newName = dataJson.header.tb_name;
    const oldBuffer = await fs.promises.readFile(newPath);
    const oldContent = oldBuffer.toString();
    obj = JSON.parse(oldContent);
    await fs.promises.appendFile(path, data);
    const newBuffer = await fs.promises.readFile(path);
    const newContent = newBuffer.toString();
    let newIItem = {
      name: newName,
      columns: newColumns,
    };
    obj.push(newIItem);
    await fs.writeFileSync(newPath, JSON.stringify(obj), "utf-8");
    let response;
    if (newContent.length > 0) {
      response = 200;
    } else {
      response = 400;
    }

    return response;
  } else {
    const oldBuffer = await fs.promises.readFile(path);
    const oldContent = oldBuffer.toString();
    obj = JSON.parse(oldContent);
    return { code: 404, table: obj };
  }
};

module.exports = {
  createQuery,
};
