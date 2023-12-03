/**
 * @param {import("express")} express
 * @param {import("sqlite3").Database} db
 */
const cadErrMessage =
  "Houve um erro ao cadastrar, tente novamente mais tarde. Caso o erro persista, consulte um administrador do site.";

module.exports = function (express, db) {
  const account = express.Router();
  account.post("/login", (req, res) => {
    res.send("Em construção...");
  });

  account.post("/cadastro", (req, res) => {
    let json = "";
    req.on("data", (data) => {
      json += data.toString();
    });
    req.on("end", () => {
      const { nickname, password, email } = JSON.parse(json);
      db.serialize(() => {
        db.run(
          `INSERT INTO accounts VALUES('${nickname}','${password}','${email}')`,
          (err) => {
            if (err) {
              console.error(err);
              return res.send(cadErrMessage);
            }
            return res.send("Cadastrado!");
          }
        );
      });
    });
  });
  return account;
};
