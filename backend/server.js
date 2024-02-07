const app = require("./app");
const connectDatabase = require("./db/Database");

//Connect DB
connectDatabase();
//Create server
try {
  const server = app.listen(process.env.PORT);
  console.log(`server is running on port:${process.env.PORT}`);
} catch (error) {
  console.log(error.message);
}
