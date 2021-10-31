var cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(cookieParser());

dotenv.config({ path: "./.env" });
require("./db/conn");
// const User = require('./models/userSchema');
app.use(express.json());
// link router file
app.use(require("./router/auth"));

const PORT = process.env.PORT || 5000;

app.get("/about", (req, res) => {
  res.send("Hello there from about");
});
// app.get("/contact", (req, res) => {
//   res.send("Hello there from contact");
// });
app.get("/signin", (req, res) => {
  res.send("Hello there from about");
});
app.get("/signup", (req, res) => {
  res.send("Hello there from contact");
});

// !== HEROKU !==
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT} 🚀`);
});
