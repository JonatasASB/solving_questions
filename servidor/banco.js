/* Armazenamento dos usuários.

   Dois destinos possíveis, escolhidos pelo ambiente:

   1. Postgres pela API REST, quando SUPABASE_URL e SUPABASE_CHAVE existem.
      É o caminho da hospedagem. O disco do contêiner volta ao estado do build
      a cada reinício — e o plano gratuito do Render dorme sozinho depois de
      alguns minutos, então reinício ali é rotina, não exceção. Guardar conta
      em arquivo lá significa perdê-la no mesmo dia.
   2. Arquivo JSON em servidor/dados/, quando não existem. É o caminho de quem
      roda na própria máquina: nada para configurar, nada para criar.

   A conversa com o Postgres é feita com fetch, contra a API REST que o
   Supabase expõe sobre a tabela. Foi de propósito: um driver de banco seria a
   primeira dependência de execução do projeto, e assim o servidor continua
   rodando só com o que vem no Node.

   Todas as funções devolvem promessa. A versão em arquivo responderia na hora,
   mas a que vai pela rede não tem como — e uma API que muda de forma conforme
   a configuração seria pior do que um await a mais em cada chamada.

   docs/deploy.md tem o SQL da tabela e onde achar as duas variáveis. */

const fs = require('fs');
const path = require('path');

const PASTA = path.join(__dirname, 'dados');
const ARQUIVO = path.join(PASTA, 'usuarios.json');

const URL_BASE = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
const CHAVE = String(process.env.SUPABASE_CHAVE || '').trim();
const TABELA = 'usuarios';

/* Uma variável só não basta: metade da configuração daria erro de
   autenticação no primeiro cadastro, em vez de cair no arquivo local. */
const remoto = Boolean(URL_BASE && CHAVE);

const PROGRESSO_ZERADO = { pontos: 0, resolvidas: [], tema: 'claro' };

/* -------------------------------------------------------- Arquivo local */

function garantirArquivo() {
  if (!fs.existsSync(PASTA)) {
    fs.mkdirSync(PASTA, { recursive: true });
  }
  if (!fs.existsSync(ARQUIVO)) {
    fs.writeFileSync(ARQUIVO, JSON.stringify({ usuarios: [] }, null, 2), 'utf8');
  }
}

function lerArquivo() {
  garantirArquivo();
  try {
    return JSON.parse(fs.readFileSync(ARQUIVO, 'utf8'));
  } catch (erro) {
    // Arquivo corrompido: não apaga nada, apenas avisa e para.
    throw new Error('Não consegui ler ' + ARQUIVO + ': ' + erro.message);
  }
}

function escreverArquivo(dados) {
  garantirArquivo();
  // Escreve em arquivo temporário e renomeia: se o processo cair no meio,
  // o arquivo original continua íntegro.
  const temporario = ARQUIVO + '.tmp';
  fs.writeFileSync(temporario, JSON.stringify(dados, null, 2), 'utf8');
  fs.renameSync(temporario, ARQUIVO);
}

/* ------------------------------------------------------------ Postgres */

/* O Postgres guarda coluna em snake_case; o resto do servidor já trabalhava
   com criadoEm. A tradução mora aqui, nas duas funções abaixo, para nenhum
   outro arquivo precisar saber que existe um banco do outro lado. */
function daLinha(linha) {
  if (!linha) return null;
  return {
    id: linha.id,
    email: linha.email,
    senha: linha.senha,
    criadoEm: linha.criado_em,
    perfil: linha.perfil,
    progresso: linha.progresso || Object.assign({}, PROGRESSO_ZERADO)
  };
}

function paraLinha(usuario) {
  return {
    id: usuario.id,
    email: usuario.email,
    senha: usuario.senha,
    criado_em: usuario.criadoEm,
    perfil: usuario.perfil,
    progresso: usuario.progresso
  };
}

async function pedir(metodo, consulta, corpo, prefer) {
  const cabecalhos = {
    'apikey': CHAVE,
    'Authorization': 'Bearer ' + CHAVE,
    'Content-Type': 'application/json'
  };
  if (prefer) cabecalhos['Prefer'] = prefer;

  const resposta = await fetch(URL_BASE + '/rest/v1/' + TABELA + '?' + consulta, {
    method: metodo,
    headers: cabecalhos,
    body: corpo ? JSON.stringify(corpo) : undefined
  });

  if (!resposta.ok) {
    /* O corpo do erro do PostgREST descreve a consulta, nunca os cabeçalhos,
       então a chave não viaja para o log junto com esta mensagem. */
    const detalhe = (await resposta.text()).slice(0, 300);
    throw new Error('banco respondeu ' + resposta.status + ': ' + detalhe);
  }

  if (resposta.status === 204) return null;      // PATCH sem retorno pedido
  return resposta.json();
}

function primeira(linhas) {
  return daLinha(Array.isArray(linhas) && linhas.length ? linhas[0] : null);
}

/* --------------------------------------------------------------- Leitura */

function normalizarEmail(email) {
  return String(email || '').trim().toLowerCase();
}

async function buscarPorEmail(email) {
  const alvo = normalizarEmail(email);

  if (!remoto) {
    return lerArquivo().usuarios.find(function (u) { return u.email === alvo; }) || null;
  }
  return primeira(await pedir('GET', 'email=eq.' + encodeURIComponent(alvo) + '&select=*&limit=1'));
}

async function buscarPorId(id) {
  if (!remoto) {
    return lerArquivo().usuarios.find(function (u) { return u.id === id; }) || null;
  }
  return primeira(await pedir('GET', 'id=eq.' + encodeURIComponent(id) + '&select=*&limit=1'));
}

async function buscarPorUsername(username) {
  const alvo = String(username || '').trim().toLowerCase();
  if (!alvo) return null;

  if (!remoto) {
    return lerArquivo().usuarios.find(function (u) {
      return u.perfil && u.perfil.username === alvo;
    }) || null;
  }
  /* perfil é jsonb: ->> tira o campo como texto. O índice que torna isso
     barato está no SQL de docs/deploy.md. */
  return primeira(await pedir('GET',
    'perfil->>username=eq.' + encodeURIComponent(alvo) + '&select=*&limit=1'));
}

/* ---------------------------------------------------------------- Escrita */

async function criar(email, senhaGuardada, perfil) {
  const usuario = {
    id: 'u' + Date.now() + Math.random().toString(36).slice(2, 8),
    email: normalizarEmail(email),
    senha: senhaGuardada,          // já vem como salt:hash, nunca em texto puro
    criadoEm: new Date().toISOString(),
    perfil: perfil || null,
    progresso: Object.assign({}, PROGRESSO_ZERADO)
  };

  if (!remoto) {
    const dados = lerArquivo();
    dados.usuarios.push(usuario);
    escreverArquivo(dados);
    return usuario;
  }

  return primeira(await pedir('POST', 'select=*', paraLinha(usuario), 'return=representation'));
}

/* Contas criadas antes de o perfil existir têm `perfil: null`. A interface
   trata isso pedindo que o usuário complete o cadastro, em vez de quebrar. */
async function atualizarPerfil(id, perfil) {
  if (!remoto) {
    const dados = lerArquivo();
    const usuario = dados.usuarios.find(function (u) { return u.id === id; });
    if (!usuario) return null;

    usuario.perfil = perfil;
    escreverArquivo(dados);
    return usuario.perfil;
  }

  const linhas = await pedir('PATCH', 'id=eq.' + encodeURIComponent(id) + '&select=*',
    { perfil: perfil }, 'return=representation');
  return Array.isArray(linhas) && linhas.length ? linhas[0].perfil : null;
}

/* Único caminho pelo qual a pontuação de uma conta muda.

   Repare no que NÃO existe aqui: uma função que recebe pontos prontos do
   cliente. Quem chama isto é o servidor, depois de ter rodado os testes e
   confirmado o acerto. Os pontos são recalculados a partir da lista de
   questões resolvidas, então não há como injetar um número.

   Ler e depois gravar deixa uma fresta: dois acertos da MESMA conta ao mesmo
   tempo poderiam perder um ponto. Fechá-la exigiria transação, que a API REST
   não oferece — e o caminho até lá não existe na interface, porque o botão de
   enviar fica desabilitado enquanto a correção não volta. */
async function registrarAcerto(id, questaoId, calcularPontos) {
  if (!remoto) {
    const dados = lerArquivo();
    const usuario = dados.usuarios.find(function (u) { return u.id === id; });
    if (!usuario) return null;

    const jaTinha = usuario.progresso.resolvidas.indexOf(questaoId) !== -1;
    if (!jaTinha) {
      usuario.progresso.resolvidas.push(questaoId);
      usuario.progresso.pontos = calcularPontos(usuario.progresso.resolvidas);
      escreverArquivo(dados);
    }

    return {
      pontos: usuario.progresso.pontos,
      resolvidas: usuario.progresso.resolvidas,
      inedita: !jaTinha
    };
  }

  const usuario = await buscarPorId(id);
  if (!usuario) return null;

  const progresso = usuario.progresso;
  const jaTinha = progresso.resolvidas.indexOf(questaoId) !== -1;

  if (!jaTinha) {
    progresso.resolvidas.push(questaoId);
    progresso.pontos = calcularPontos(progresso.resolvidas);
    await pedir('PATCH', 'id=eq.' + encodeURIComponent(id), { progresso: progresso });
  }

  return {
    pontos: progresso.pontos,
    resolvidas: progresso.resolvidas,
    inedita: !jaTinha
  };
}

/* ------------------------------------------------------------- Diagnóstico */

/* Chamado uma vez ao subir. Uma conta que some é sintoma difícil de ler depois
   do fato; dizer no log onde as contas estão sendo guardadas, e falhar alto se
   o banco configurado não responde, transforma isso numa linha óbvia. */
async function conferir() {
  if (!remoto) {
    garantirArquivo();

    /* Metade da configuração é quase sempre engano: quem definiu uma das duas
       variáveis queria o banco, e cairia no arquivo sem perceber. */
    const pelaMetade = Boolean(URL_BASE) !== Boolean(CHAVE);
    return {
      destino: 'arquivo',
      ok: true,
      aviso: pelaMetade
        ? 'SUPABASE_URL e SUPABASE_CHAVE: só uma das duas está definida, então o banco foi ignorado.'
        : null,
      detalhe: ARQUIVO
    };
  }

  try {
    await pedir('GET', 'select=id&limit=1');
    return { destino: 'postgres', ok: true, aviso: null, detalhe: URL_BASE };
  } catch (erro) {
    return { destino: 'postgres', ok: false, aviso: null, detalhe: erro.message };
  }
}

module.exports = {
  buscarPorEmail: buscarPorEmail,
  buscarPorId: buscarPorId,
  buscarPorUsername: buscarPorUsername,
  criar: criar,
  atualizarPerfil: atualizarPerfil,
  registrarAcerto: registrarAcerto,
  normalizarEmail: normalizarEmail,
  conferir: conferir
};
