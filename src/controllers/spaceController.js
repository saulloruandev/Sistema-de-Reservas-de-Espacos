const service = require("../services/spaceService");

function executar(res, funcao, status = 200) {
  try {
    const resultado = funcao();
    if (resultado === undefined) return res.status(204).send();
    return res.status(status).json(resultado);
  } catch (erro) {
    return res.status(erro.status || 500).json({ erro: erro.message || "Erro interno." });
  }
}

module.exports = {
  listar: (req, res) => executar(res, () => service.listar()),
  buscar: (req, res) => executar(res, () => service.buscarPorId(req.params.id)),
  criar: (req, res) => executar(res, () => service.criar(req.body), 201),
  atualizar: (req, res) => executar(res, () => service.atualizar(req.params.id, req.body)),
  excluir: (req, res) => executar(res, () => service.excluir(req.params.id))
};
