const sqliteParser = require("sqlite-parser");

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
