const express = require("express");
const authRoutes = require("./routes/authRoutes");
const spaceRoutes = require("./routes/spaceRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API do Sistema de Reservas de Espaços funcionando!",
    rotas: ["/api/auth", "/api/spaces", "/api/reservations"]
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/reservations", reservationRoutes);

// Rota inexistente
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// Tratamento centralizado de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

module.exports = app;
