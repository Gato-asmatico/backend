//Database consts
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./sqlite/epicdb");
//Express consts
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});