// Modelo: liga um usuário a um espaço em determinado período.
function criarReserva({ id, userId, spaceId, dataInicio, dataFim, quantidadePessoas, status = "ATIVA" }) {
  return {
    id,
    userId,
    spaceId,
    dataInicio,
    dataFim,
    quantidadePessoas: Number(quantidadePessoas),
    status
  };
}

module.exports = { criarReserva };
