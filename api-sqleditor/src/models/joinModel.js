const path = require("path");
const fs = require("fs");
const axios = require("axios");
const TABLES_PATH = path.join(__dirname + "/../db/tables.json");
const SERVERS_PATH = path.join(__dirname + "/../db/servers.json");
let tables = require(TABLES_PATH);
let servers = require(SERVERS_PATH);

/**
 * Parseo de query: Insert
 * @param {*} statements
 * @returns Valores insertados
 */
const joinQuery = async (statements) => {
  try {
    /**
     * JSON de Tablas dentro del servidor
     */
    let json_tables = {};
    if (tables.length > 0) {
      for (let i = 0; i < tables.length; i++) {
        json_tables[tables[i].name] = tables[i].name;
      }
    }

    /**
     * Tabla 1 para el join
     */

    // Validar el nombre de la tabla 1 y el server 1
    let full_table_name1 = statements.from.source.name.split(".");
    let database1;
    let table_name1;
    if (full_table_name1.length > 2) {
      let response = {
        status: 1,
        message: "La tabla 1 es incorrecta",
        table: {},
      };
      return response;
    } else if (full_table_name1.length == 2) {
      database1 = full_table_name1[0];
      table_name1 = full_table_name1[1];
    } else if (full_table_name1.length == 1) {
      database1 = "co";
      table_name1 = full_table_name1[0];
    }

    let table1;
    let table_name_bd1 = database1 + "." + table_name1;
    let alias1 = statements.from.source.alias;

    // Validar alias obligatorio
    if (typeof alias1 == "undefined") {
      let response = {
        status: 1,
        message: "La tabla 1 debe tener un alias",
        table: {},
      };
      return response;
    }

    if (database1 === "co") {
      // Validar que la tabla 2 exista en el servidor

      let path = "files/" + table_name1 + ".json";
      let file = fs.existsSync(path);
      if (!file) {
        let response = {
          status: 1,
          message: `La tabla 1: ${table_name1} no existe en el servidor ${database1}`,
          table: {},
        };
        return response;
      }
      const oldBuffer = await fs.promises.readFile(path);
      const oldContent = oldBuffer.toString();
      obj = JSON.parse(oldContent);
      table1 = { columns: obj.columns, rows: obj.data };
    } else {
      if (typeof servers[database1] === "undefined") {
        let response = {
          status: 1,
          message: `El servidor ${database1} no existe.`,
          table: {},
        };
        return response;
      }
      let endpoint = servers[database1] + "/parseQuery";
      let query = `select * from ${table_name_bd1};`;
      let res;
      try {
        res = await axios({
          method: "post",
          url: endpoint,
          data: {
            query: query,
            origin: "co",
          },
        });
        res = res.data;
      } catch (error) {
        let errorRes = {
          status: 1,
          message: "Ocurrio un problema con la conexión",
          table: {},
        };
        return errorRes;
      }
      if (typeof res.status == "undefined") {
        let response = {
          status: 1,
          message: "Ocurrio un problema con la conexión",
          table: {},
        };
        return response;
      }
      if (res.status == 1) {
        let response = {
          status: 1,
          message: res.message,
          table: {},
        };
        return response;
      }
      table1 = {
        columns: res.table.columns,
        rows: res.table.data,
      };
    }

    /**
     * Tabla 2 para el join
     */
    let full_table_name2 = statements.from.map[0].source.name.split(".");
    let database2;
    let table_name2;

    // Validar nombre de la tabla 2 y el server
    if (full_table_name2.length > 2) {
      let response = {
        status: 1,
        message: "La tabla 1 es incorrecta",
        table: {},
      };
      return response;
    } else if (full_table_name2.length == 2) {
      database2 = full_table_name2[0];
      table_name2 = full_table_name2[1];
    } else if (full_table_name2.length == 1) {
      database2 = "co";
      table_name2 = full_table_name2[0];
    }

    let table2;
    let table_name_bd2 = database2 + "." + table_name2;
    let alias2 = statements.from.map[0].source.alias;

    // Validar el alias obligatorio
    if (typeof alias2 == "undefined") {
      let response = {
        status: 1,
        message: "La tabla 2 debe tener un alias",
        table: {},
      };
      return response;
    }

    if (database2 === "co") {
      // Validar que la tabla 2 exista en el servidor
      let path = "files/" + table_name2 + ".json";
      let file = fs.existsSync(path);
      if (!file) {
        let response = {
          status: 1,
          message: `La tabla 2: ${table_name2} no existe en el servidor ${database2}`,
          table: {},
        };
        return response;
      }
      const oldBuffer = await fs.promises.readFile(path);
      const oldContent = oldBuffer.toString();
      obj = JSON.parse(oldContent);
      table2 = { columns: obj.columns, rows: obj.data };
    } else {
      if (typeof servers[database2] === "undefined") {
        let response = {
          status: 1,
          message: `El servidor ${database2} no existe.`,
          table: {},
        };
        return response;
      }
      let endpoint = servers[database2] + "/parseQuery";
      let query = `select * from ${table_name_bd2};`;
      let res;
      try {
        res = await axios({
          method: "post",
          url: endpoint,
          data: {
            query: query,
            origin: "co",
          },
        });
        res = res.data;
      } catch (error) {
        let errorRes = {
          status: 1,
          message: "Ocurrio un problema con la conexión",
          table: {},
        };
        return errorRes;
      }
      if (typeof res.status == "undefined") {
        let response = {
          status: 1,
          message: "Ocurrio un problema con la conexión",
          table: {},
        };
        return response;
      }
      if (res.status == 1) {
        let response = {
          status: 1,
          message: res.message,
          table: {},
        };
        return response;
      }
      table2 = {
        columns: res.table.columns,
        rows: res.table.data,
      };
    }

    if (alias1 == alias2) {
      let response = {
        status: 1,
        message: "Los alias no pueden ser iguales",
        table: {},
      };
      return response;
    }

    /**
     * Tablas para hacer el join
     */

    tables = {};
    tables[alias1] = table1;
    tables[alias2] = table2;

    /**
     * Columnas de las dos tablas con su índices
     */

    let column_index = {};
    let columns_table1 = table1.columns;
    for (let i = 0; i < columns_table1.length; i++) {
      column_index[alias1 + "." + columns_table1[i]] = i;
    }
    let columns_table2 = table2.columns;
    for (let i = 0; i < columns_table2.length; i++) {
      column_index[alias2 + "." + columns_table2[i]] = i;
    }

    /**
     * Parseo de las columnas con el select
     */
    let columns = [];
    let results = statements.result;
    for (let i = 0; i < results.length; i++) {
      if (results[i].name == "*") {
        for (let j = 0; j < columns_table1.length; j++) {
          columns.push(alias1 + "." + columns_table1[j]);
        }
        for (let j = 0; j < columns_table2.length; j++) {
          columns.push(alias2 + "." + columns_table2[j]);
        }
      } else if (results[i].name == alias1 + ".*") {
        for (let j = 0; j < columns_table1.length; j++) {
          columns.push(alias1 + "." + columns_table1[j]);
        }
      } else if (results[i].name == alias2 + ".*") {
        for (let j = 0; j < columns_table1.length; j++) {
          columns.push(alias2 + "." + columns_table2[j]);
        }
      } else {
        columns.push(results[i].name);
      }
    }

    /**
     * Validar que las columnas existan en las tablas
     */
    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];
      if (typeof column_index[item] == "undefined") {
        let response = {
          status: 1,
          message: `Las tablas no tiene el campo ${item}, las columnas deben tener alias`,
          table: {},
        };
        return response;
      }
    }

    /**
     * Validar si viene una o dos condiciones
     */

    let flag_2_condiciones = false;
    let cond_left1;
    let cond_right1;
    let cond_left2;
    let cond_right2;
    let cond_left1_alias;
    let cond_right1_alias;
    let cond_left2_alias;
    // Validar si vienen dos condiciones por medio de and
    if (statements.where[0].operation == "and") {
      flag_2_condiciones = true;
      cond_left1 = statements.where[0].left.left.name;
      cond_right1 = statements.where[0].left.right.name;
      cond_left2 = statements.where[0].right.left.name;
      cond_right2 =
        statements.where[0].right.right.name ||
        statements.where[0].right.right.value;
    } else {
      // Validar si viene solo una condición
      cond_left1 = statements.where[0].left.name;
      cond_right1 = statements.where[0].right.name;
    }

    // Obtener los alias de las condiciones
    cond_left1_alias = cond_left1.split(".")[0];
    cond_right1_alias = cond_right1.split(".")[0];

    // Validar el alias de la segunda condición
    if (flag_2_condiciones) {
      cond_left2_alias = cond_left2.split(".")[0];
    }

    // Validar que todas las columnas existan
    if (typeof column_index[cond_left1] == "undefined") {
      let response = {
        status: 1,
        message: `No existe la columna ${cond_left1}`,
        table: {},
      };
      return response;
    }
    if (typeof column_index[cond_right1] == "undefined") {
      let response = {
        status: 1,
        message: `No existe la columna ${cond_right1}`,
        table: {},
      };
      return response;
    }
    if (flag_2_condiciones && typeof column_index[cond_left2] == "undefined") {
      let response = {
        status: 1,
        message: `No existe la columna ${cond_left2}`,
        table: {},
      };
      return response;
    }

    let rows = [];
    for (let i = 0; i < table1.rows.length; i++) {
      for (let j = 0; j < table2.rows.length; j++) {
        let row = [];
        let cl1id = cond_left1_alias == alias1 ? i : j;
        let cr1id = cond_right1_alias == alias1 ? i : j;
        if (
          tables[cond_left1_alias].rows[cl1id][column_index[cond_left1]] !=
          tables[cond_right1_alias].rows[cr1id][column_index[cond_right1]]
        )
          continue;
        if (flag_2_condiciones) {
          let cl2id = cond_left2_alias == alias1 ? i : j;
          if (
            tables[cond_left2_alias].rows[cl2id][column_index[cond_left2]] !=
            cond_right2
          )
            continue;
        }
        for (let k = 0; k < columns.length; k++) {
          let column_alias = columns[k].split(".")[0];
          let caid = column_alias == alias1 ? i : j;
          row.push(tables[column_alias].rows[caid][column_index[columns[k]]]);
        }
        rows.push(row);
      }
    }

    /**
     * Tablas y server que realizaron el join
     */
    let tables_join = [table_name1, table_name1];
    let databases_join = [database1, database2];

    /**
     * Estructura de los json para las tablas
     */

    let table_final = {
      header: {
        tb_name: tables_join,
        db_name: databases_join,
        columns: columns.length,
      },
      columns: columns,
      data: rows,
    };

    /**
     * Respuesta final de join
     */
    let response_out = {
      status: 0,
      message: `Select Join de las tablas ${table_name_bd1} y ${table_name_bd2} correctamente`,
      table: table_final,
    };
    return response_out;
  } catch (error) {
    let response = {
      status: 1,
      message: "Error",
    };
    return response;
  }
};

module.exports = { joinQuery };
