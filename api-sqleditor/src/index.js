const app = require("./config/server");

// Rutas
require("./app/routes/usuario")(app);
require("./app/routes/dbs")(app);
require("./app/routes/query")(app);
require("./app/routes/create")(app);
require("./app/routes/insert")(app);
require("./app/routes/update")(app);

app.listen(app.get("port"), () => {
  console.log(`Server running port ${app.get("port")}`);
});
