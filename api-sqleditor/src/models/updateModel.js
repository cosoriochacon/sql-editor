const fs = require("fs");

/**
 * Parseo de query: Update
 * @param {*} statements
 * @returns Valores editados
 */
const updateQuery = async (statements) => {
  try {
    let into = statements.into.name;
    let column;
    if (statements.where !== undefined) {
      column = statements.where[0].left.name;
    }
    let nameTable = into.split(".")[1].trim();
    let nameDB = into.split(".")[0].trim();
    let nameFile = nameTable + ".json";
    let path = "files/" + nameFile;
    const file_res = await appendDataToFile(path, statements);
    if (file_res.code === 200) {
      let response = {
        status: 0,
        message: `Update table ${nameTable} on server ${nameDB} successfull`,
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
    } else if (file_res === 403) {
      let response = {
        status: 1,
        message: `The application only supports equality condition =`,
        table: {},
      };
      return response;
    } else if (file_res === 406) {
      let response = {
        status: 1,
        message: `The application only supports a condition in the where`,
        table: {},
      };
      return response;
    } else if (file_res === 408) {
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
    
    let index_columns = {};
    for (let i = 0; i < obj.columns.length; i++) {
      index_columns[obj.columns[i]] = i;
    }

    let data_modify = [];
    let columns_modify = [];
    for (let i = 0; i < statements.set.length; i++) {
      data_modify.push(statements.set[i].value.name);
      columns_modify.push(statements.set[i].target.name);
    }

    if (statements.where !== undefined) {
      let pos_where = obj.columns.indexOf(statements.where[0].left.name);

      if (pos_where === -1) return 408;
  
      if (statements.where[0].operation !== "=") return 403;
  
      if (statements.where.length !== 1) return 406;
  
      let value = statements.where[0].right.name;
      let cont = 0;
      for (let i = 0; i < obj.data.length; i++) {
        if (value === obj.data[i][pos_where]) {
          cont++;
          for (let j = 0; j < columns_modify.length; j++) {
            obj.data[i][index_columns[columns_modify[j]]] = data_modify[j];
          }
        }
      }
    } else {
      for (let i = 0; i < obj.data.length; i++) {
        for (let j = 0; j < columns_modify.length; j++) {
          obj.data[i][index_columns[columns_modify[j]]] = data_modify[j];
        }
      }
    }


    let json = JSON.stringify(obj);
    await fs.writeFileSync(path, json, "utf-8");

    return { code: 200, table: obj };
  } else {
    return 400;
  }
};

module.exports = {
  updateQuery,
};
