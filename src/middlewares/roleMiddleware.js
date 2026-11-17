// Permite que apenas os perfis informados acessem a rota.
function permitirPerfis(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({ erro: "Você não tem permissão para esta operação." });
    }

    next();
  };
}

module.exports = permitirPerfis;
