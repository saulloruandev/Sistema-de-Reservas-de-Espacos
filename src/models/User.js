// Modelo: representa os dados de um usuário.
function criarUsuario({ id, nome, email, senha, perfil = "USER" }) {
  return { id, nome, email, senha, perfil };
}

module.exports = { criarUsuario };
