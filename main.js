const express = require("express");
const app = express();
const { jogos, account } = require("./routes/routes");

const port = 3001;

/*
Falta fazer:

  implementação da API para pesquisar nome de jogo
  implementação da API para fazer cadastro de conta
  implementação da API para fazer login em conta
*/

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "POST, GET",
  });
  next();
});

app.use("/jogos", jogos);
app.use("/account", account);

app.listen(port,"0.0.0.0", () => {
  console.log(`http://localhost:${port}`);
});
