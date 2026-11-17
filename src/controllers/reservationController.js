const service = require("../services/reservationService");

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
  criar: (req, res) => executar(res, () => service.criar(req.usuario.id, req.body), 201),
  minhas: (req, res) => executar(res, () => service.listarDoUsuario(req.usuario.id)),
  todas: (req, res) => executar(res, () => service.listarTodas()),
  buscar: (req, res) => executar(res, () => service.buscar(req.params.id, req.usuario)),
  atualizar: (req, res) => executar(res, () => service.atualizar(req.params.id, req.usuario, req.body)),
  cancelar: (req, res) => executar(res, () => service.cancelar(req.params.id, req.usuario)),
  excluir: (req, res) => executar(res, () => service.excluir(req.params.id, req.usuario))
};
