const queryString = require("node:querystring");
const dbErrMessage = "Houve um erro durante a consulta :(";

/**
 * @param {import("express")} express
 * @param {import("sqlite3").Database} db
 */

module.exports = function (express, db) {
  const jogos = express.Router();

  jogos.get("/", (req, res) => {
    db.serialize(() => {
      db.all(`SELECT * FROM jogos`, (err, rows) => {
        if (err) {
          console.error(err);
          return res.json({ success: false, content: dbErrMessage });
        }
        res.json({ success: true, content: rows });
      });
    });
  });

  jogos.get("/search", (req, res) => {
    const queries = queryString.parse(
      req.url.slice(req.url.lastIndexOf("?") + 1)
    );
    let sqlInput = `SELECT * FROM jogos WHERE nome LIKE '${queries.q}%'`;

    if (queries.g) {
      if (Array.isArray(queries.g)) {
        let generoLength = queries.g.length;
        sqlInput += ` AND (genero LIKE '${queries.g[0]}'`;

        for (let n = 1; n < generoLength; ++n) {
          sqlInput += ` OR genero LIKE '${queries.g[n]}'`;
          if (n == generoLength - 1) sqlInput += ")";
        }
      } else {
        sqlInput += ` AND genero LIKE '${queries.g}'`;
      }
    }

    db.serialize(() => {
      db.all(sqlInput, (err, rows) => {
        if (err) {
          console.error(err);
          return res.json({ success: false, content: dbErrMessage });
        }
        res.json({ success: true, content: rows });
      });
    });
  });

  jogos.get("/genero", (req, res) => {
    const generos = [];
    db.serialize(() => {
      db.all("SELECT genero FROM jogos", (err, rows) => {
        if (err) {
          console.error(err);
          return res.json({ success: false, content: dbErrMessage });
        }

        res.json({
          success: true,
          content: rows
            .map(({ genero }, index, array) => {
              if (generos.includes(genero)) return "";
              generos.push(genero);
              return genero;
            })
            .filter((x) => x),
        });
      });
    });
  });

  jogos.get(/\/genero\/.*/, (req, res) => {
    // console.log("url: %s\tbase: %s\toriginal: %s", req.url, req.baseUrl, req.originalUrl);
    // url: /genero/Fantasia   base: /jogos    original: /jogos/genero/Fantasia
    // http://localhost:3000/jogos/genero/Fantasia

    const genero = decodeURIComponent(
      req.url.slice(req.url.lastIndexOf("/") + 1)
    );
    db.serialize(() => {
      db.all(
        `SELECT * FROM jogos WHERE genero LIKE '${genero}'`,
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.json({ success: false, content: dbErrMessage });
          }
          res.json({ success: true, content: rows });
        }
      );
    });
  });

  return jogos;
};
