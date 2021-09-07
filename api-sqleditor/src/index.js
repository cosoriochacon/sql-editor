const app = require("./config/server");

// Rutas
require("./app/routes/usuario")(app);
require("./app/routes/dbs")(app);
require("./app/routes/file")(app);
require("./app/routes/query")(app);

app.listen(app.get("port"), () => {
  console.log(`Server running port ${app.get("port")}`);
});
