const app = require("./config/server");

// Rutas
require("./routes/user")(app);
require("./routes/parser")(app);
require("./routes/schemas")(app);

app.listen(app.get("port"), () => {
  console.log(`Server running port ${app.get("port")}`);
});
