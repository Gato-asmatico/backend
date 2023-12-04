const crypto = require("node:crypto");
const salt = "yYol6HgCQwiaGftW7AsFHX84AsUd24";
const cadErrMessage =
  "Houve um erro ao cadastrar, tente novamente mais tarde. Caso o erro persista, consulte um administrador do site.";

/**
 * @param {import("express")} express
 * @param {import("sqlite3").Database} db
 */
module.exports = function (express, db) {
  const account = express.Router();
  account.post("/login", (req, res) => {
    let json = "";
    req.on("data", (data) => {
      json += data.toString();
    });

    req.on("end", () => {
      const { nickname, password } = JSON.parse(json);
      
      const hash = crypto
        .createHash("sha256")
        .update(salt + password)
        .digest("hex");

      //console.log("Login", nickname, password, hash);

      db.serialize(() => {
        db.get(
          `SELECT password FROM accounts WHERE nickname LIKE '${nickname}'`,
          (err, { password }) => {

            if (err) {
              console.error(err);
              return res.json({ sucess: false, content: cadErrMessage });
            }

            if (password == hash) {
              res.json({
                success: true,
                content: "Logado com sucesso!",
              });
            } else {
              res.json({
                sucess: false,
                content: "Credenciais incorretas!",
              });
            }
          }
        );
      });
    });
  });

  account.post("/cadastro", (req, res) => {
    let json = "";

    req.on("data", (data) => {
      json += data.toString();
    });

    req.on("end", () => {
      const { nickname, password, email } = JSON.parse(json);

      const hash = crypto
        .createHash("sha256")
        .update(salt + password)
        .digest("hex");

      //console.log("cadastro", nickname, password, hash, email);

      db.serialize(() => {
        db.get(
          `SELECT * FROM accounts WHERE nickname LIKE '${nickname}'`,
          (err, row) => {

            if (err) {
              console.error(err);
              return res.json({ sucess: false, content: cadErrMessage });
            }

            if (!row) {
              db.run(
                `INSERT INTO accounts VALUES('${nickname}','${hash}','${email}')`,
                (err) => {

                  if (err) {
                    console.error(err);
                    return res.json({ sucess: false, content: cadErrMessage });
                  }

                  return res.json({ sucess: true, content: "Cadastrado!" });
                }
              );
            } else {
              return res.json({ sucess: false, content: "Nickname já cadastrado!" });
            }
          }
        );
      });
    });
  });
  return account;
};
