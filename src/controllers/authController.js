const authService = require("../services/authService");

async function cadastrar(req, res) {
  try {
    const usuario = await authService.cadastrar(req.body);
    return res.status(201).json({ mensagem: "Usuário cadastrado.", usuario });
  } catch (erro) {
    return res.status(erro.status || 500).json({ erro: erro.message || "Erro ao cadastrar." });
  }
}

async function login(req, res) {
  try {
    const resultado = await authService.login(req.body);
    return res.status(200).json(resultado);
  } catch (erro) {
    return res.status(erro.status || 500).json({ erro: erro.message || "Erro ao fazer login." });
  }
}

module.exports = { cadastrar, login };
