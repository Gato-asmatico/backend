//Database consts
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/epicdb", (err) => {
  if (err) console.error("Erro ao iniciar a Database: ", err);
});
//Express consts
const express = require("express");
const app = express();
const port = 3000;

app.get("/jogos", (req, res) => {
  db.serialize(() => {
    db.all(`SELECT * FROM jogos`, (err, rows) => {
      if (err) return res.send("Houve um erro :(");
      res.json(rows);
    });
  });
});

app.get("/jogos/genero", (req, res) => {
  const generos = [];
  db.serialize(() => {
    db.all("SELECT genero FROM jogos", (err, rows) => {
      if (err) return res.send("Houve um erro :(");

      res.json(
        rows
          .map(({ genero }, index, array) => {
            if (generos.includes(genero)) return "";
            generos.push(genero);
            return genero;
          })
          .filter((x) => x)
      );
    });
  });
});

app.get(/jogos\/genero\/.*/, (req, res) => {
  const genero = decodeURIComponent(req.url.slice(req.url.lastIndexOf("/") + 1));
  db.serialize(() => {
    db.all(`SELECT * FROM jogos WHERE genero LIKE '${genero}'`, (err, rows) => {
      res.json(rows);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
