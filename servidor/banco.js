/* Armazenamento dos usuários.

   Um arquivo JSON é suficiente para a escala deste projeto: são poucos
   registros e um processo só escrevendo. Se um dia houver muitos usuários ou
   mais de um processo, este é o arquivo a trocar por um banco de verdade —
   o resto do servidor não precisa saber a diferença. */

const fs = require('fs');
const path = require('path');

const PASTA = path.join(__dirname, 'dados');
const ARQUIVO = path.join(PASTA, 'usuarios.json');

function garantirArquivo() {
  if (!fs.existsSync(PASTA)) {
    fs.mkdirSync(PASTA, { recursive: true });
  }
  if (!fs.existsSync(ARQUIVO)) {
    fs.writeFileSync(ARQUIVO, JSON.stringify({ usuarios: [] }, null, 2), 'utf8');
  }
}

function ler() {
  garantirArquivo();
  try {
    return JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'));
  } catch (erro) {
    // Arquivo corrompido: não apaga nada, apenas avisa e para.
    throw new Error('Não consegui ler ' + ARQUIVO + ': ' + erro.message);
  }
}

function escrever(dados) {
  garantirArquivo();
  // Escreve em arquivo temporário e renomeia: se o processo cair no meio,
  // o arquivo original continua íntegro.
  const temporario = ARQUIVO + '.tmp';
  fs.writeFileSync(temporario, JSON.stringify(dados, null, 2), 'utf8');
  fs.renameSync(temporario, ARQUIVO);
}

function normalizarEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function buscarPorEmail(email) {
  const alvo = normalizarEmail(email);
  return ler().usuarios.find(function (u) { return u.email === alvo; }) || null;
}

function buscarPorId(id) {
  return ler().usuarios.find(function (u) { return u.id === id; }) || null;
}

function buscarPorUsername(username) {
  const alvo = String(username || '').trim().toLowerCase();
  if (!alvo) return null;
  return ler().usuarios.find(function (u) {
    return u.perfil && u.perfil.username === alvo;
  }) || null;
}

function criar(email, senhaGuardada, perfil) {
  const dados = ler();
  const usuario = {
    id: 'u' + Date.now() + Math.random().toString(36).slice(2, 8),
    email: normalizarEmail(email),
    senha: senhaGuardada,          // já vem como salt:hash, nunca em texto puro
    criadoEm: new Date().toISOString(),
    perfil: perfil || null,
    progresso: { pontos: 0, resolvidas: [], tema: 'claro' }
  };
  dados.usuarios.push(usuario);
  escrever(dados);
  return usuario;
}

/* Contas criadas antes de o perfil existir têm `perfil: null`. A interface
   trata isso pedindo que o usuário complete o cadastro, em vez de quebrar. */
function atualizarPerfil(id, perfil) {
  const dados = ler();
  const usuario = dados.usuarios.find(function (u) { return u.id === id; });
  if (!usuario) return null;

  usuario.perfil = perfil;
  escrever(dados);
  return usuario.perfil;
}

/* Único caminho pelo qual a pontuação de uma conta muda.

   Repare no que NÃO existe aqui: uma função que recebe pontos prontos do
   cliente. Quem chama isto é o servidor, depois de ter rodado os testes e
   confirmado o acerto. Os pontos são recalculados a partir da lista de
   questões resolvidas, então não há como injetar um número. */
function registrarAcerto(id, questaoId, calcularPontos) {
  const dados = ler();
  const usuario = dados.usuarios.find(function (u) { return u.id === id; });
  if (!usuario) return null;

  const jaTinha = usuario.progresso.resolvidas.indexOf(questaoId) !== -1;
  if (!jaTinha) {
    usuario.progresso.resolvidas.push(questaoId);
    usuario.progresso.pontos = calcularPontos(usuario.progresso.resolvidas);
    escrever(dados);
  }

  return {
    pontos: usuario.progresso.pontos,
    resolvidas: usuario.progresso.resolvidas,
    inedita: !jaTinha
  };
}

module.exports = {
  buscarPorEmail: buscarPorEmail,
  buscarPorId: buscarPorId,
  buscarPorUsername: buscarPorUsername,
  criar: criar,
  atualizarPerfil: atualizarPerfil,
  registrarAcerto: registrarAcerto,
  normalizarEmail: normalizarEmail
};
