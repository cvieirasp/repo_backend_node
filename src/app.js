const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getIndex(id) {
  return repositories.findIndex(repo => repo.id === id);
}

function validateInsert(request, response, next) {
  const { title, url, techs } = request.body;

  if (!title) {
    return response.status(400).json({ message: 'Campo Titulo obrigatorio!' });
  }

  if (!url) {
    return response.status(400).json({ message: `Campo URL obrigatório!` });
  }

  return next();
}

function validateId(request, response, next) {
  const { id } = request.params;
  
  if (!isUuid(id)) {
    return response.status(400).json({ message: 'ID do Repositorio invalido!' });
  }

  return next();
}

app.use("/repositories/:id", validateId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.get("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = getIndex(id);

  if (index < 0) {
    return response.status(400).json({ message: 'Repositorio nao encontrado!' });
  }

  const repo = repositories[index];

  return response.json(repo);
});

app.post("/repositories", validateInsert, (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = getIndex(id);

  if (index < 0) {
    return response.status(400).json({ message: 'Repositorio nao encontrado!' });
  }

  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[index].likes,
  }

  repositories[index] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = getIndex(id);

  if (index < 0) {
    return response.status(400).json({ message: 'Repositorio nao encontrado!' });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = getIndex(id);

  if (index < 0) {
    return response.status(400).json({ message: 'Repositorio nao encontrado!' });
  }

  const repo = repositories[index];
  repo.likes++;
  return response.json({ likes: repo.likes});
});

module.exports = app;
