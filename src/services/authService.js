const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const { criarUsuario } = require("../models/User");

async function cadastrar({ nome, email, senha }) {
  if (!nome || !email || !senha) {
    throw { status: 400, message: "Informe nome, email e senha." };
  }

  if (senha.length < 6) {
    throw { status: 400, message: "A senha precisa ter pelo menos 6 caracteres." };
  }

  if (userRepository.findByEmail(email)) {
    throw { status: 409, message: "Este email já está cadastrado." };
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = criarUsuario({
    id: Date.now().toString(),
    nome,
    email,
    senha: senhaHash,
    perfil: "USER" // O cadastro público nunca cria ADMIN.
  });

  userRepository.create(usuario);

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil
  };
}

async function login({ email, senha }) {
  const usuario = userRepository.findByEmail(email || "");

  if (!usuario || !(await bcrypt.compare(senha || "", usuario.senha))) {
    throw { status: 401, message: "Email ou senha incorretos." };
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  return {
    mensagem: "Login realizado com sucesso.",
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    }
  };
}

module.exports = { cadastrar, login };
