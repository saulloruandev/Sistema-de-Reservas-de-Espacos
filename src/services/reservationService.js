const reservationRepository = require("../repositories/reservationRepository");
const spaceRepository = require("../repositories/spaceRepository");
const userRepository = require("../repositories/userRepository");
const { criarReserva } = require("../models/Reservation");

function validarPeriodo(dataInicio, dataFim) {
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  if (!dataInicio || !dataFim || Number.isNaN(inicio.getTime()) ||
      Number.isNaN(fim.getTime()) || inicio >= fim) {
    throw { status: 400, message: "Informe datas válidas e a data final deve ser posterior à inicial." };
  }

  if (inicio <= new Date()) {
    throw { status: 400, message: "A reserva deve começar no futuro." };
  }
}

function verificarConflito(spaceId, dataInicio, dataFim, ignorarId = null) {
  const inicioNovo = new Date(dataInicio);
  const fimNovo = new Date(dataFim);

  const conflito = reservationRepository.findAll().some((reserva) => {
    if (reserva.id === ignorarId || reserva.spaceId !== spaceId || reserva.status !== "ATIVA") {
      return false;
    }

    const inicioExistente = new Date(reserva.dataInicio);
    const fimExistente = new Date(reserva.dataFim);

    // Existe conflito quando os períodos se sobrepõem.
    return inicioNovo < fimExistente && fimNovo > inicioExistente;
  });

  if (conflito) {
    throw { status: 409, message: "Este espaço já está reservado nesse período." };
  }
}

function validarRelacoes(userId, spaceId, quantidadePessoas) {
  const usuario = userRepository.findById(userId);
  if (!usuario) throw { status: 404, message: "Usuário não encontrado." };

  const espaco = spaceRepository.findById(spaceId);
  if (!espaco) throw { status: 404, message: "Espaço não encontrado." };

  if (!Number.isInteger(Number(quantidadePessoas)) || Number(quantidadePessoas) <= 0) {
    throw { status: 400, message: "A quantidade de pessoas deve ser um número positivo." };
  }

  if (Number(quantidadePessoas) > espaco.capacidade) {
    throw { status: 400, message: `A capacidade máxima deste espaço é ${espaco.capacidade} pessoas.` };
  }

  return espaco;
}

function criar(userId, dados) {
  const { spaceId, dataInicio, dataFim, quantidadePessoas } = dados;

  validarPeriodo(dataInicio, dataFim);
  validarRelacoes(userId, spaceId, quantidadePessoas);
  verificarConflito(spaceId, dataInicio, dataFim);

  const reserva = criarReserva({
    id: Date.now().toString(),
    userId,
    spaceId,
    dataInicio,
    dataFim,
    quantidadePessoas,
    status: "ATIVA"
  });

  return reservationRepository.create(reserva);
}

function listarDoUsuario(userId) {
  return reservationRepository.findAll().filter((reserva) => reserva.userId === userId);
}

function listarTodas() {
  return reservationRepository.findAll().map(comDetalhes);
}

function comDetalhes(reserva) {
  const usuario = userRepository.findById(reserva.userId);
  const espaco = spaceRepository.findById(reserva.spaceId);

  return {
    ...reserva,
    usuario: usuario ? { id: usuario.id, nome: usuario.nome, email: usuario.email } : null,
    espaco: espaco || null
  };
}

function buscar(id, usuario) {
  const reserva = reservationRepository.findById(id);
  if (!reserva) throw { status: 404, message: "Reserva não encontrada." };

  if (usuario.perfil !== "ADMIN" && reserva.userId !== usuario.id) {
    throw { status: 403, message: "Você só pode acessar suas próprias reservas." };
  }

  return comDetalhes(reserva);
}

function atualizar(id, usuario, dados) {
  const reserva = reservationRepository.findById(id);
  if (!reserva) throw { status: 404, message: "Reserva não encontrada." };

  if (usuario.perfil !== "ADMIN" && reserva.userId !== usuario.id) {
    throw { status: 403, message: "Você só pode alterar suas próprias reservas." };
  }

  if (reserva.status === "CANCELADA") {
    throw { status: 409, message: "Uma reserva cancelada não pode ser alterada." };
  }

  const novoSpaceId = dados.spaceId || reserva.spaceId;
  const novoInicio = dados.dataInicio || reserva.dataInicio;
  const novoFim = dados.dataFim || reserva.dataFim;
  const novaQuantidade = dados.quantidadePessoas ?? reserva.quantidadePessoas;

  validarPeriodo(novoInicio, novoFim);
  validarRelacoes(reserva.userId, novoSpaceId, novaQuantidade);
  verificarConflito(novoSpaceId, novoInicio, novoFim, id);

  const atualizada = reservationRepository.update(id, {
    spaceId: novoSpaceId,
    dataInicio: novoInicio,
    dataFim: novoFim,
    quantidadePessoas: Number(novaQuantidade)
  });

  return comDetalhes(atualizada);
}

function cancelar(id, usuario) {
  const reserva = reservationRepository.findById(id);
  if (!reserva) throw { status: 404, message: "Reserva não encontrada." };

  if (usuario.perfil !== "ADMIN" && reserva.userId !== usuario.id) {
    throw { status: 403, message: "Você só pode cancelar suas próprias reservas." };
  }

  if (reserva.status === "CANCELADA") {
    throw { status: 409, message: "Esta reserva já está cancelada." };
  }

  return reservationRepository.update(id, { status: "CANCELADA" });
}

function excluir(id, usuario) {
  const reserva = reservationRepository.findById(id);
  if (!reserva) throw { status: 404, message: "Reserva não encontrada." };

  if (usuario.perfil !== "ADMIN" && reserva.userId !== usuario.id) {
    throw { status: 403, message: "Você só pode excluir suas próprias reservas." };
  }

  reservationRepository.remove(id);
}

module.exports = {
  criar, listarDoUsuario, listarTodas, buscar, atualizar, cancelar, excluir
};
