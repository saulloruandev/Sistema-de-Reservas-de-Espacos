const fs = require("fs");
const path = require("path");

// Cada entidade possui seu próprio arquivo JSON.
function criarRepositorio(nomeArquivo) {
  const caminho = path.join(__dirname, "..", "data", nomeArquivo);

  function lerTodos() {
    const conteudo = fs.readFileSync(caminho, "utf8");
    return JSON.parse(conteudo);
  }

  function salvarTodos(registros) {
    fs.writeFileSync(caminho, JSON.stringify(registros, null, 2));
  }

  function findAll() {
    return lerTodos();
  }

  function findById(id) {
    return lerTodos().find((item) => item.id === id);
  }

  function create(registro) {
    const registros = lerTodos();
    registros.push(registro);
    salvarTodos(registros);
    return registro;
  }

  function update(id, dados) {
    const registros = lerTodos();
    const indice = registros.findIndex((item) => item.id === id);

    if (indice === -1) return null;

    registros[indice] = { ...registros[indice], ...dados, id };
    salvarTodos(registros);
    return registros[indice];
  }

  function remove(id) {
    const registros = lerTodos();
    const filtrados = registros.filter((item) => item.id !== id);

    if (filtrados.length === registros.length) return false;

    salvarTodos(filtrados);
    return true;
  }

  return { findAll, findById, create, update, remove };
}

module.exports = criarRepositorio;
