require("dotenv").config();

const app = require("./app");
const userRepository = require("./repositories/userRepository");
const bcrypt = require("bcryptjs");

const PORT = process.env.PORT || 3000;

async function criarAdminInicial() {
  const email = process.env.ADMIN_EMAIL || "admin@reservas.com";
  const senha = process.env.ADMIN_PASSWORD || "Admin123!";
  const existente = await userRepository.findByEmail(email);

  if (!existente) {
    const senhaHash = await bcrypt.hash(senha, 10);

    await userRepository.create({
      id: Date.now().toString(),
      nome: process.env.ADMIN_NAME || "Administrador",
      email,
      senha: senhaHash,
      perfil: "ADMIN"
    });

    console.log("Administrador inicial criado.");
  }
}

async function iniciarServidor() {
  await criarAdminInicial();

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

iniciarServidor().catch((erro) => {
  console.error("Não foi possível iniciar o servidor:", erro);
});
