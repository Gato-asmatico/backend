//Database consts
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/epicdb", (err) => {
  if (err) console.error("Erro ao iniciar a Database: ", err);
});
module.exports = db;