const spaceRepository = require("../repositories/spaceRepository");
const reservationRepository = require("../repositories/reservationRepository");
const { criarEspaco } = require("../models/Space");

function listar() {
  return spaceRepository.findAll();
}

function buscarPorId(id) {
  const espaco = spaceRepository.findById(id);
  if (!espaco) throw { status: 404, message: "Espaço não encontrado." };
  return espaco;
}

function criar(dados) {
  const { nome, tipo, capacidade, localizacao } = dados;

  if (!nome || !tipo || !capacidade || !localizacao) {
    throw { status: 400, message: "Informe nome, tipo, capacidade e localização." };
  }

  if (!Number.isInteger(Number(capacidade)) || Number(capacidade) <= 0) {
    throw { status: 400, message: "A capacidade deve ser um número inteiro positivo." };
  }

  const espaco = criarEspaco({
    id: Date.now().toString(),
    ...dados
  });

  return spaceRepository.create(espaco);
}

function atualizar(id, dados) {
  buscarPorId(id);

  if (dados.capacidade !== undefined &&
      (!Number.isInteger(Number(dados.capacidade)) || Number(dados.capacidade) <= 0)) {
    throw { status: 400, message: "A capacidade deve ser um número inteiro positivo." };
  }

  const atualizado = spaceRepository.update(id, dados);
  return atualizado;
}

function excluir(id) {
  buscarPorId(id);

  const possuiReservaAtiva = reservationRepository.findAll().some(
    (reserva) => reserva.spaceId === id && reserva.status === "ATIVA"
  );

  if (possuiReservaAtiva) {
    throw { status: 409, message: "Não é possível excluir um espaço com reservas ativas." };
  }

  spaceRepository.remove(id);
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
