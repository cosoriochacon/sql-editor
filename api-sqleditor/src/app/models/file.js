const sqliteParser = require("sqlite-parser");
// async function queryParser(query) {
//   let json;
//   sqliteParser(query, async (err, ast) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     let statements = ast.statement[0];
//     let variant = statements.variant;
//     let nameTable = statements.name.name;
//     let arr_columns = statements.definition;
//     console.log(arr_columns);
//     let columns = [];
//     for (let i = 0; i < arr_columns.length; i++) {
//       columns.push(arr_columns[i].name);
//     }
//     json = { nameTable, columns };
//     //   return json;
//   });
//   return json;
// }

const queryParser = async (query) => {
  try {
    const ast = sqliteParser(query);
    let statements = ast.statement[0];
    return statements;
  } catch (error) {
    return error;
  }
};

module.exports = {
  queryParser,
};
