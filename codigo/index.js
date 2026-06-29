// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo implementa uma API RESTful baseada no JSONServer
// O servidor JSONServer fica hospedado na seguinte URL
// https://jsonserver.rommelpuc.repl.co/contatos
//
// Para montar um servidor para o seu projeto, acesse o projeto 
// do JSONServer no Replit, faça o FORK do projeto e altere o 
// arquivo db.json para incluir os dados do seu projeto.
//
// URL Projeto JSONServer: https://replit.com/@rommelpuc/JSONServer
//
// Autor: Rommel Vieira Carneiro
// Data: 03/10/2023

const express = require("express");
const fs = require("fs");
const jsonServer = require("json-server");
const path = require("path");

const app = express();
const publicDir = path.join(__dirname, "public");
const router = jsonServer.router(path.join(__dirname, "db", "db.json"));
const middlewares = jsonServer.defaults({ noCors: true });
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "25mb" }));
app.use(jsonServer.bodyParser);
app.use(middlewares);
app.use(express.static(publicDir));

function sendPublicFile(req, res, relativePath) {
  const filePath = path.join(publicDir, relativePath);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
    return true;
  }
  return false;
}

app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "home.html"));
});

app.get("/home.html", (_req, res) => {
  res.sendFile(path.join(publicDir, "home.html"));
});

app.get("/about.html", (_req, res) => {
  res.sendFile(path.join(publicDir, "about.html"));
});

app.get("/modulos/login/login.html", (_req, res) => {
  res.sendFile(path.join(publicDir, "modulos", "login", "login.html"));
});

app.get("/modulos/login/index.html", (_req, res) => {
  res.sendFile(path.join(publicDir, "modulos", "login", "index.html"));
});

app.get("*.html", (req, res, next) => {
  const requestedPath = decodeURIComponent(req.path).replace(/^\/+/, "");
  if (sendPublicFile(req, res, requestedPath)) return;
  next();
});

app.use(router);

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Servidor ativo em http://127.0.0.1:${PORT}`);
});
