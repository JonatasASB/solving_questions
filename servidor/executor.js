/* Executa o código do usuário fora do processo do servidor.

   Cada correção abre um processo novo, curto, que morre logo depois. Assim um
   laço infinito, um estouro de memória ou uma trava do usuário não afetam o
   servidor: o pai simplesmente mata o filho e responde o erro. */

const path = require('path');
const { fork } = require('child_process');

const SANDBOX = path.join(__dirname, 'sandbox.js');
const LIMITE_MS = 2000;
const LIMITE_MEMORIA_MB = 128;
const CORRECOES_SIMULTANEAS = 4;

/* O modelo de permissões do Node é o que bloqueia sistema de arquivos,
   subprocessos e `process.binding` dentro do sandbox. A leitura liberada é
   apenas a do próprio sandbox.js, sem a qual o processo nem carrega. */
const ARGUMENTOS = [
  '--permission',
  '--allow-fs-read=' + SANDBOX,
  '--max-old-space-size=' + LIMITE_MEMORIA_MB
];

let permissoesDisponiveis = true;

/* Fila simples: sem ela, várias correções ao mesmo tempo abririam processos
   sem limite e derrubariam a máquina. */
let rodando = 0;
const espera = [];

function proximo() {
  if (rodando >= CORRECOES_SIMULTANEAS || espera.length === 0) return;
  const tarefa = espera.shift();
  rodando += 1;
  tarefa().finally(function () {
    rodando -= 1;
    proximo();
  });
}

function enfileirar(tarefa) {
  return new Promise(function (resolver) {
    espera.push(function () {
      const p = tarefa();
      p.then(resolver, function (erro) {
        resolver({ ok: false, tipo: 'execucao', erro: erro.message });
      });
      return p;
    });
    proximo();
  });
}

function executarAgora(questao, codigo) {
  return new Promise(function (resolver) {
    let filho;

    try {
      filho = fork(SANDBOX, [], {
        execArgv: permissoesDisponiveis ? ARGUMENTOS : [],
        stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
        env: {}                       // nenhuma variável de ambiente vaza
      });
    } catch (erro) {
      resolver({ ok: false, tipo: 'execucao', erro: 'Não consegui iniciar o corretor.' });
      return;
    }

    let encerrado = false;

    function encerrar(resposta) {
      if (encerrado) return;
      encerrado = true;
      clearTimeout(relogio);
      if (!filho.killed) filho.kill('SIGKILL');
      resolver(resposta);
    }

    const relogio = setTimeout(function () {
      encerrar({
        ok: false,
        tipo: 'tempo',
        erro: 'Seu código passou de ' + (LIMITE_MS / 1000) + ' segundos e foi interrompido. ' +
              'Isso costuma ser um laço que nunca termina — confira a condição de parada.'
      });
    }, LIMITE_MS);

    filho.on('message', encerrar);

    filho.on('error', function () {
      encerrar({ ok: false, tipo: 'execucao', erro: 'O corretor falhou ao rodar seu código.' });
    });

    filho.on('exit', function (codigoSaida) {
      // Saiu sem mandar resposta: normalmente memória estourada ou process.exit.
      encerrar({
        ok: false,
        tipo: 'execucao',
        erro: 'Seu código encerrou sem devolver resultado (código ' + codigoSaida + ').'
      });
    });

    filho.send({
      codigo: codigo,
      assinatura: questao.assinatura,
      testes: questao.testes,
      mockFetch: questao.mockFetch || null
    });
  });
}

function corrigir(questao, codigo) {
  return enfileirar(function () { return executarAgora(questao, codigo); });
}

/* Confere uma vez, ao subir o servidor, se este Node aceita o modelo de
   permissões. Se não aceitar, o projeto continua funcionando — mas o aviso
   precisa aparecer, porque a proteção principal caiu. */
async function conferirIsolamento() {
  const teste = { assinatura: 'somar', testes: [{ entrada: [1, 2], esperado: 3 }] };
  const resultado = await executarAgora(teste, 'function somar(a, b) { return a + b; }');

  if (resultado.ok && resultado.todosPassaram) {
    return { isolado: true };
  }

  permissoesDisponiveis = false;
  const semPermissao = await executarAgora(teste, 'function somar(a, b) { return a + b; }');
  return {
    isolado: false,
    funcionando: Boolean(semPermissao.ok && semPermissao.todosPassaram)
  };
}

module.exports = {
  corrigir: corrigir,
  conferirIsolamento: conferirIsolamento,
  LIMITE_MS: LIMITE_MS
};
