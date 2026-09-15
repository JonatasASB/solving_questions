/* Autenticação: guarda de senha e emissão de token.

   Nada aqui é feito à mão do zero — usa o módulo `crypto` do próprio Node:
   scrypt para derivar a senha e HMAC-SHA256 para assinar o token. */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/* Janela de inatividade: o token vale 3 dias contados a partir do último uso,
   não da data do login. Todo pedido autenticado devolve um token novo com o
   prazo reiniciado (ver renovarToken), então quem usa o site continua dentro;
   quem some por 3 dias precisa informar e-mail e senha de novo. */
const HORAS_DE_INATIVIDADE = 24 * 3;

/* O segredo assina os tokens. É gerado uma vez e guardado em disco: se ele
   mudar, todos os tokens emitidos deixam de valer e os usuários precisam
   entrar de novo — o que é o comportamento correto, não uma falha. */
function obterSegredo() {
  const pasta = path.join(__dirname, 'dados');
  const arquivo = path.join(pasta, 'segredo.txt');

  if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });

  if (!fs.existsSync(arquivo)) {
    fs.writeFileSync(arquivo, crypto.randomBytes(48).toString('hex'), 'utf8');
  }
  return fs.readFileSync(arquivo, 'utf8').trim();
}

const SEGREDO = obterSegredo();

/* ------------------------------------------------------------------ Senha */

/* A senha nunca é guardada. O que vai para o banco é o resultado de passá-la
   pelo scrypt junto com um sal aleatório — de onde não dá para voltar. O sal
   é diferente por usuário, então duas pessoas com a mesma senha têm registros
   diferentes, e uma tabela pronta de senhas comuns não serve para nada. */
function guardarSenha(senha) {
  const sal = crypto.randomBytes(16).toString('hex');
  const derivada = crypto.scryptSync(senha, sal, 64).toString('hex');
  return sal + ':' + derivada;
}

function conferirSenha(senha, guardada) {
  const partes = String(guardada || '').split(':');
  if (partes.length !== 2) return false;

  const sal = partes[0];
  const esperada = Buffer.from(partes[1], 'hex');

  let obtida;
  try {
    obtida = crypto.scryptSync(senha, sal, 64);
  } catch (erro) {
    return false;
  }

  if (obtida.length !== esperada.length) return false;

  // timingSafeEqual compara em tempo constante: sem ele, o tempo de resposta
  // vazaria quantos caracteres iniciais estavam certos.
  return crypto.timingSafeEqual(obtida, esperada);
}

/* ------------------------------------------------------------------ Token */

function base64url(texto) {
  return Buffer.from(texto, 'utf8').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deBase64url(texto) {
  const normal = texto.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normal, 'base64').toString('utf8');
}

function assinar(conteudo) {
  return crypto.createHmac('sha256', SEGREDO).update(conteudo).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/* O token carrega quem é o usuário e até quando vale, mais uma assinatura.
   O conteúdo é legível por quem tiver o token — por isso não guarda nada
   sensível —, mas não é forjável sem o segredo do servidor. */
function gerarToken(usuario) {
  const dados = {
    id: usuario.id,
    email: usuario.email,
    expiraEm: Date.now() + HORAS_DE_INATIVIDADE * 60 * 60 * 1000
  };
  const corpo = base64url(JSON.stringify(dados));
  return corpo + '.' + assinar(corpo);
}

/* Reinicia a contagem dos 3 dias a partir de agora. Recebe o conteúdo de um
   token já validado por lerToken, não o registro do banco: renovar não é hora
   de ir ao disco, e quem o token diz ser a assinatura já garantiu. */
function renovarToken(dados) {
  return gerarToken({ id: dados.id, email: dados.email });
}

function lerToken(token) {
  if (typeof token !== 'string') return null;

  const partes = token.split('.');
  if (partes.length !== 2) return null;

  const corpo = partes[0];
  const assinaturaRecebida = partes[1];
  const assinaturaEsperada = assinar(corpo);

  // Comparação em tempo constante, mesmo motivo da senha.
  const a = Buffer.from(assinaturaRecebida);
  const b = Buffer.from(assinaturaEsperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  let dados;
  try {
    dados = JSON.parse(deBase64url(corpo));
  } catch (erro) {
    return null;
  }

  if (!dados.expiraEm || Date.now() > dados.expiraEm) return null;

  return dados;
}

/* ------------------------------------------------------------- Validação */

function emailValido(email) {
  const texto = String(email || '').trim();
  if (texto.length < 5 || texto.length > 120) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
}

function problemaNaSenha(senha) {
  const texto = String(senha || '');
  if (texto.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.';
  if (texto.length > 200) return 'A senha é longa demais.';
  return null;
}

module.exports = {
  guardarSenha: guardarSenha,
  conferirSenha: conferirSenha,
  gerarToken: gerarToken,
  renovarToken: renovarToken,
  lerToken: lerToken,
  HORAS_DE_INATIVIDADE: HORAS_DE_INATIVIDADE,
  emailValido: emailValido,
  problemaNaSenha: problemaNaSenha
};
