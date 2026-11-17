// Modelo: representa um espaço que pode ser reservado.
function criarEspaco({ id, nome, tipo, capacidade, localizacao, descricao = "" }) {
  return { id, nome, tipo, capacidade: Number(capacidade), localizacao, descricao };
}

module.exports = { criarEspaco };
