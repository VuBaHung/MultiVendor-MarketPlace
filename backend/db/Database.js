const mongoose = require("mongoose");
const connectDatabase = () => {
  try {
    mongoose
      .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((data) => {
        console.log(`Mongodb connected to server :${data.connection.host}`);
      });
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = connectDatabase;
