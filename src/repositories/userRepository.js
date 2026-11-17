const criarRepositorio = require("./jsonRepository");
const repositorio = criarRepositorio("users.json");

function findByEmail(email) {
  return repositorio.findAll().find(
    (usuario) => usuario.email.toLowerCase() === email.toLowerCase()
  );
}

module.exports = { ...repositorio, findByEmail };
