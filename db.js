const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const db = mongoose.connection;

mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.CONNECTIONSTRING,
  { useUnifiedTopology: true, useUnifiedTopology: true },
  function (err, client) {
    module.exports = client;
    const app = require("./server.js");
    app.listen(process.env.PORT || 20727, "0.0.0.0");
  }
);

db.on("error", console.error.bind(console, "MongoDB connection error:"));
