const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("uncaught Rejection error");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATA_SOURCE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("conected successfully.....");
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`server is lestning on ${port} ......`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandled Rejection error");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
