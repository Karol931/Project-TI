const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const db = mongoose.connection;
const port = process.env.PORT || 20727;

mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.CONNECTIONSTRING,
  { useUnifiedTopology: true, useUnifiedTopology: true },
  function (err, client) {
    module.exports = client;
    const app = require("./server.js");
    app.listen(port);
  }
);

db.on("error", console.error.bind(console, "MongoDB connection error:"));
