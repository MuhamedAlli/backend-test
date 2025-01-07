require("dotenv").config();

const app = require("./app");

const server = app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shitting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
