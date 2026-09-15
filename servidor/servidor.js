/* Servidor do Resolução de Questões.

   Serve os arquivos do site e a API de contas. Sem dependências: só os
   módulos que já vêm no Node. Para subir:

       node servidor/servidor.js

   e abrir http://localhost:3000

   O site continua funcionando sem o servidor (duplo clique no index.html) —
   nesse caso o progresso fica só no navegador, sem conta. */

const http = require('http');
const fs = require('fs');
const path = require('path');

const banco = require('./banco');
const auth = require('./auth');
const questoes = require('./questoes');
const executor = require('./executor');
const perfil = require('./perfil');

const PORTA = process.env.PORTA || 3000;
const RAIZ = path.join(__dirname, '..');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

/* Freio simples contra tentativa de adivinhar senha: conta as falhas por
   e-mail e segura por alguns minutos depois de várias erradas seguidas.
   Vive em memória, então reiniciar o servidor limpa a contagem. */
/* Mesmos números do PRD 4.4, agora decididos pelo servidor. */
const LIMITE_DICA = 5;
const LIMITE_SOLUCAO = 10;

const TENTATIVAS_MAXIMAS = 8;
const BLOQUEIO_MS = 5 * 60 * 1000;
const falhas = new Map();

function estaBloqueado(chave) {
  const registro = falhas.get(chave);
  if (!registro) return false;
  if (Date.now() > registro.liberaEm) {
    falhas.delete(chave);
    return false;
  }
  return registro.contagem >= TENTATIVAS_MAXIMAS;
}

function registrarFalha(chave) {
  const registro = falhas.get(chave) || { contagem: 0, liberaEm: 0 };
  registro.contagem += 1;
  registro.liberaEm = Date.now() + BLOQUEIO_MS;
  falhas.set(chave, registro);
}

function limparFalhas(chave) {
  falhas.delete(chave);
}

/* --------------------------------------------------------------- Respostas */

function responderJson(res, status, corpo) {
  const texto = JSON.stringify(corpo);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(texto),
    'Cache-Control': 'no-store'
  });
  res.end(texto);
}

/* O código acompanha a mensagem para a interface poder traduzir. A mensagem
   em português continua indo junto como reserva, caso a tela não conheça o
   código. */
function responderErro(res, status, codigo, mensagem) {
  responderJson(res, status, { erro: mensagem, codigo: codigo });
}

function lerCorpo(req) {
  return new Promise(function (resolver, rejeitar) {
    let bruto = '';
    req.on('data', function (pedaco) {
      bruto += pedaco;
      if (bruto.length > 100000) {          // corta payload absurdo
        rejeitar(new Error('corpo grande demais'));
        req.destroy();
      }
    });
    req.on('end', function () {
      if (!bruto) return resolver({});
      try {
        resolver(JSON.parse(bruto));
      } catch (erro) {
        rejeitar(new Error('JSON inválido'));
      }
    });
    req.on('error', rejeitar);
  });
}

function usuarioDaRequisicao(req) {
  const cabecalho = req.headers['authorization'] || '';
  if (!cabecalho.startsWith('Bearer ')) return null;
  return auth.lerToken(cabecalho.slice(7));
}

/* -------------------------------------------------------------------- API */

async function cadastrar(req, res) {
  const corpo = await lerCorpo(req);
  const email = banco.normalizarEmail(corpo.email);
  const senha = corpo.senha;

  if (!auth.emailValido(email)) {
    return responderErro(res, 400, 'email_invalido', 'E-mail inválido.');
  }
  if (senha === undefined || String(senha).length < 8) {
    return responderErro(res, 400, 'senha_curta', 'A senha precisa ter pelo menos 8 caracteres.');
  }
  if (String(senha).length > 200) {
    return responderErro(res, 400, 'senha_longa', 'A senha é longa demais.');
  }
  if (banco.buscarPorEmail(email)) {
    return responderErro(res, 409, 'email_em_uso', 'Já existe uma conta com este e-mail.');
  }

  const conferido = perfil.validar(corpo.perfil, idsDeLinguagem());
  if (conferido.erro) {
    return responderErro(res, 400, conferido.erro, 'Confira os dados do perfil.');
  }
  if (banco.buscarPorUsername(conferido.perfil.username)) {
    return responderErro(res, 409, 'username_em_uso', 'Este nome de usuário já está em uso.');
  }

  const usuario = banco.criar(email, auth.guardarSenha(senha), conferido.perfil);
  responderJson(res, 201, {
    token: auth.gerarToken(usuario),
    email: usuario.email,
    perfil: usuario.perfil,
    progresso: usuario.progresso
  });
}

function idsDeLinguagem() {
  return questoes.LINGUAGENS.map(function (l) { return l.id; });
}

function lerPerfil(req, res) {
  const dono = usuarioDaRequisicao(req);
  if (!dono) return responderErro(res, 401, 'sem_sessao', 'Faça login novamente.');

  const usuario = banco.buscarPorId(dono.id);
  if (!usuario) return responderErro(res, 404, 'conta_sumiu', 'Conta não encontrada.');

  // Conta criada antes do perfil existir devolve null; a tela pede para completar.
  responderJson(res, 200, { email: usuario.email, perfil: usuario.perfil || null });
}

async function gravarPerfil(req, res) {
  const dono = usuarioDaRequisicao(req);
  if (!dono) return responderErro(res, 401, 'sem_sessao', 'Faça login novamente.');

  const corpo = await lerCorpo(req);
  const conferido = perfil.validar(corpo, idsDeLinguagem());
  if (conferido.erro) {
    return responderErro(res, 400, conferido.erro, 'Confira os dados do perfil.');
  }

  // O username é único, mas o dono pode manter o próprio sem conflito.
  const jaUsado = banco.buscarPorUsername(conferido.perfil.username);
  if (jaUsado && jaUsado.id !== dono.id) {
    return responderErro(res, 409, 'username_em_uso', 'Este nome de usuário já está em uso.');
  }

  const salvo = banco.atualizarPerfil(dono.id, conferido.perfil);
  if (!salvo) return responderErro(res, 404, 'conta_sumiu', 'Conta não encontrada.');

  responderJson(res, 200, { perfil: salvo });
}

async function entrar(req, res) {
  const corpo = await lerCorpo(req);
  const email = banco.normalizarEmail(corpo.email);
  const senha = corpo.senha;

  if (estaBloqueado(email)) {
    return responderErro(res, 429, 'muitas_tentativas',
      'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.');
  }

  const usuario = banco.buscarPorEmail(email);

  /* A mesma mensagem para e-mail inexistente e senha errada: dizer qual dos
     dois falhou entregaria a quem está tentando adivinhar a informação de
     quais e-mails têm conta aqui. */
  if (!usuario || !auth.conferirSenha(senha, usuario.senha)) {
    registrarFalha(email);
    return responderErro(res, 401, 'credenciais_invalidas', 'E-mail ou senha incorretos.');
  }

  limparFalhas(email);
  responderJson(res, 200, {
    token: auth.gerarToken(usuario),
    email: usuario.email,
    perfil: usuario.perfil || null,
    progresso: usuario.progresso
  });
}

/* Quem está pedindo. Conta logada tem id do banco; visitante usa o
   identificador que o próprio navegador gera. Para visitante isso serve só
   para contar tentativas — a pontuação dele não entra em conta nenhuma. */
function identidade(req) {
  const dono = usuarioDaRequisicao(req);
  if (dono) return { tipo: 'usuario', id: dono.id };

  const sessao = String(req.headers['x-sessao'] || '').slice(0, 64);
  return { tipo: 'convidado', id: 'c:' + (sessao || 'anonimo') };
}

/* Tentativas por (quem, questão). Ficam em memória: reiniciar o servidor zera
   os contadores, o que só significa que a dica demora um pouco mais a
   aparecer. Não compensa gravar em disco por isso. */
const tentativas = new Map();
const TETO_TENTATIVAS = 50000;

function contarFalha(chave) {
  if (tentativas.size > TETO_TENTATIVAS) tentativas.clear();
  const total = (tentativas.get(chave) || 0) + 1;
  tentativas.set(chave, total);
  return total;
}

function catalogoDeQuestoes(req, res) {
  responderJson(res, 200, questoes.catalogo());
}

/* O coração da mudança: a correção acontece aqui, não no navegador.

   Consequências:
     - a pontuação não é mais enviada pelo cliente, é decidida aqui;
     - dica e solução só saem depois das falhas necessárias;
     - os casos de teste nunca chegam ao navegador.                        */
async function corrigirQuestao(req, res) {
  const corpo = await lerCorpo(req);

  const questao = questoes.porId(corpo.questaoId);
  if (!questao) return responderJson(res, 404, { erro: 'Questão não encontrada.' });

  const codigo = String(corpo.codigo || '');
  if (!codigo.trim()) return responderJson(res, 400, { erro: 'Escreva sua resposta antes de enviar.' });
  if (codigo.length > 20000) return responderJson(res, 400, { erro: 'Código longo demais.' });

  const quem = identidade(req);
  const chave = quem.id + '|' + questao.id;

  const resultado = await executor.corrigir(questao, codigo);
  const acertou = Boolean(resultado.ok && resultado.todosPassaram);

  let falhas;
  if (acertou) {
    falhas = 0;
    tentativas.delete(chave);
  } else {
    falhas = contarFalha(chave);
  }

  const resposta = {
    ok: resultado.ok,
    tipo: resultado.tipo,
    erro: resultado.erro,
    resultados: resultado.resultados,
    todosPassaram: acertou,
    tentativas: falhas
  };

  // Dica a partir da 5ª falha, solução a partir da 10ª — decidido aqui.
  if (falhas >= LIMITE_DICA) resposta.dica = questao.dica;
  if (falhas >= LIMITE_SOLUCAO) {
    resposta.solucao = questao.solucao;
    resposta.explicacao = questao.explicacao;
  }

  if (acertou) {
    resposta.pontosDaQuestao = questoes.pontosDoNivel(questao.nivel);

    if (quem.tipo === 'usuario') {
      const progresso = banco.registrarAcerto(quem.id, questao.id, questoes.pontosDe);
      if (progresso) {
        resposta.progresso = { pontos: progresso.pontos, resolvidas: progresso.resolvidas };
        resposta.inedita = progresso.inedita;
      }
    } else {
      // Visitante: o navegador guarda o próprio progresso, que não vale nota.
      resposta.convidado = true;
    }
  }

  responderJson(res, 200, resposta);
}

function lerProgresso(req, res) {
  const dono = usuarioDaRequisicao(req);
  if (!dono) return responderJson(res, 401, { erro: 'Faça login novamente.' });

  const usuario = banco.buscarPorId(dono.id);
  if (!usuario) return responderJson(res, 404, { erro: 'Conta não encontrada.' });

  responderJson(res, 200, { email: usuario.email, progresso: usuario.progresso });
}

/* --------------------------------------------------------------- Estáticos */

/* Lista de permissão em vez de lista de bloqueio: qualquer arquivo novo na
   pasta do projeto — inclusive servidor/dados/, que guarda os hashes de senha
   e o segredo que assina os tokens — fica fora do alcance por padrão, sem
   ninguém precisar lembrar de bloqueá-lo. */
function caminhoPermitido(relativo) {
  if (relativo === 'index.html' || relativo === 'login.html') return true;
  return relativo.startsWith('assets/');
}

function servirArquivo(req, res) {
  const caminhoUrl = decodeURIComponent((req.url || '/').split('?')[0]);
  const relativo = caminhoUrl === '/' ? 'index.html' : caminhoUrl.replace(/^\/+/, '');
  const arquivo = path.join(RAIZ, relativo);

  const normalizado = relativo.split(String.fromCharCode(92)).join("/");

  /* Impede sair da pasta do projeto com ../ e serve apenas o que está na
     lista de permissão. */
  if (!arquivo.startsWith(RAIZ) || !caminhoPermitido(normalizado)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Não encontrado');
    return;
  }

  fs.readFile(arquivo, function (erro, dados) {
    if (erro) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Não encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
    res.end(dados);
  });
}

/* ------------------------------------------------------------------ Rotas */

/* Não existe rota para gravar progresso. Ela era a porta pela qual dava para
   enviar qualquer pontuação; agora o progresso só muda como consequência de
   uma resposta correta verificada em /api/corrigir. */
const ROTAS = {
  'POST /api/cadastrar': cadastrar,
  'POST /api/entrar': entrar,
  'GET /api/questoes': catalogoDeQuestoes,
  'POST /api/corrigir': corrigirQuestao,
  'GET /api/progresso': lerProgresso,
  'GET /api/perfil': lerPerfil,
  'PUT /api/perfil': gravarPerfil
};

const servidor = http.createServer(function (req, res) {
  const caminho = (req.url || '/').split('?')[0];
  const chave = req.method + ' ' + caminho;

  if (caminho.startsWith('/api/')) {
    const acao = ROTAS[chave];
    if (!acao) return responderJson(res, 404, { erro: 'Rota não encontrada.' });

    Promise.resolve()
      .then(function () { return acao(req, res); })
      .catch(function (erro) {
        // A mensagem interna não vai para o cliente; fica só no log.
        console.error('[erro]', chave, erro.message);
        if (!res.headersSent) responderJson(res, 400, { erro: 'Não consegui processar o pedido.' });
      });
    return;
  }

  servirArquivo(req, res);
});

servidor.listen(PORTA, async function () {
  console.log('Resolução de Questões rodando em http://localhost:' + PORTA);

  const isolamento = await executor.conferirIsolamento();
  if (isolamento.isolado) {
    console.log('Correção isolada: processo separado + modelo de permissões do Node.');
  } else if (isolamento.funcionando) {
    console.warn('AVISO: este Node não aceitou --permission. A correção roda em processo');
    console.warn('separado com limite de tempo, mas sem bloqueio de arquivos e subprocessos.');
    console.warn('Não exponha este servidor na internet.');
  } else {
    console.error('ERRO: não consegui executar o corretor. As questões não serão corrigidas.');
  }

  console.log('Para parar: Ctrl+C');
});
