/* Onde o código enviado pelo usuário realmente roda.

   Este arquivo NUNCA é chamado direto: o executor.js o abre como processo
   separado, com o modelo de permissões do Node ligado. Nesse modo o processo
   não consegue ler arquivos, abrir subprocessos nem usar `process.binding` —
   que é o caminho clássico de fuga de sandbox em JavaScript.

   Camadas de proteção, da mais forte para a mais fraca:
     1. processo separado, morto pelo pai se passar do tempo
     2. --permission: sem sistema de arquivos, sem subprocesso
     3. o código do usuário roda em `new Function`, onde `require` não existe
     4. `fetch` é trocado pelo mock da questão, então não há saída de rede

   Recebe { codigo, assinatura, testes, mockFetch } e devolve o resultado. */

'use strict';

// Guarda o que é preciso para responder antes de fechar as portas.
const responder = process.send.bind(process);
const encerrar = process.exit.bind(process);

/* Nada aqui embaixo depende mais de `process`, então ele sai do alcance do
   código do usuário. Sem isso, `new Function('return process')()` devolveria
   um objeto com caminhos para fora da caixa. */
function fecharPortas() {
  globalThis.process = undefined;
  globalThis.require = undefined;
  globalThis.module = undefined;
  globalThis.__dirname = undefined;
  globalThis.__filename = undefined;
}

/* ------------------------------------------------------------ Comparação */

/* Tolerante a três coisas que reprovariam uma resposta certa sem motivo:
   imprecisão de ponto flutuante, ordem das chaves de um objeto, e NaN, que
   nunca é igual a si mesmo. */
function iguais(a, b) {
  if (a === b) return true;

  if (typeof a === 'number' && typeof b === 'number') {
    if (isNaN(a) && isNaN(b)) return true;
    return Math.abs(a - b) < 1e-9;
  }

  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const chavesA = Object.keys(a);
  const chavesB = Object.keys(b);
  if (chavesA.length !== chavesB.length) return false;

  for (let i = 0; i < chavesA.length; i++) {
    const chave = chavesA[i];
    if (!Object.prototype.hasOwnProperty.call(b, chave)) return false;
    if (!iguais(a[chave], b[chave])) return false;
  }
  return true;
}

function descrever(valor) {
  if (valor === undefined) return 'undefined';
  if (typeof valor === 'function') return 'função';
  try {
    const texto = JSON.stringify(valor);
    return texto === undefined ? String(valor) : texto;
  } catch (erro) {
    return String(valor);
  }
}

function rotulo(teste, assinatura) {
  if (teste.chamada) return teste.chamada;
  const argumentos = (teste.entrada || []).map(descrever).join(', ');
  return assinatura + '(' + argumentos + ')';
}

/* Respostas fixas no lugar da API real: o exercício funciona offline e não
   quebra se a API sair do ar. Também é o que fecha a saída de rede. */
function instalarMockFetch(mocks) {
  globalThis.fetch = function (url) {
    const alvo = String(url);
    for (let i = 0; i < mocks.length; i++) {
      if (alvo.indexOf(mocks[i].contem) !== -1) {
        const corpo = mocks[i].resposta;
        const deuCerto = mocks[i].ok !== false;
        return Promise.resolve({
          ok: deuCerto,
          status: mocks[i].status || (deuCerto ? 200 : 404),
          json: function () { return Promise.resolve(JSON.parse(JSON.stringify(corpo))); },
          text: function () { return Promise.resolve(JSON.stringify(corpo)); }
        });
      }
    }
    return Promise.reject(new Error('Este exercício não conhece a URL ' + alvo + '. Confira o endereço do enunciado.'));
  };
}

/* -------------------------------------------------------------- Execução */

function rodarUmTeste(codigo, assinatura, teste) {
  return new Promise(function (resolver, rejeitar) {
    let executor;
    const prefixo = codigo + '\n;';

    try {
      if (teste.chamada) {
        executor = new Function('__entrada', prefixo + 'return (async function () {\n' + teste.chamada + '\n})();');
      } else {
        executor = new Function('__entrada', prefixo +
          'if (typeof ' + assinatura + ' === "undefined") {' +
          '  throw new Error("Não encontrei nada chamado ' + assinatura + ' no seu código. Confira o nome.");' +
          '}\n' +
          'return ' + assinatura + '.apply(null, __entrada);');
      }
    } catch (erro) {
      rejeitar(erro);
      return;
    }

    let bruto;
    try {
      bruto = executor(teste.entrada || []);
    } catch (erro) {
      rejeitar(erro);
      return;
    }

    // Cobre função comum e função assíncrona com o mesmo caminho.
    Promise.resolve(bruto).then(resolver, rejeitar);
  });
}

function rodar(dados) {
  const codigo = dados.codigo;
  const assinatura = dados.assinatura;
  const testes = dados.testes || [];

  if (dados.mockFetch) {
    instalarMockFetch(dados.mockFetch);
  } else {
    // Questão sem API não tem por que alcançar a rede.
    globalThis.fetch = function () {
      return Promise.reject(new Error('Esta questão não usa requisições.'));
    };
  }

  // Erro de sintaxe é detectado antes de qualquer teste rodar.
  try {
    new Function(codigo);
  } catch (erro) {
    return Promise.resolve({ ok: false, tipo: 'sintaxe', erro: erro.message });
  }

  const resultados = [];
  let cadeia = Promise.resolve();

  testes.forEach(function (teste) {
    cadeia = cadeia.then(function () {
      return rodarUmTeste(codigo, assinatura, teste).then(
        function (obtido) {
          resultados.push({
            rotulo: rotulo(teste, assinatura),
            esperado: descrever(teste.esperado),
            obtido: descrever(obtido),
            passou: iguais(obtido, teste.esperado)
          });
        },
        function (erro) {
          resultados.push({
            rotulo: rotulo(teste, assinatura),
            esperado: descrever(teste.esperado),
            obtido: (erro && erro.message) ? erro.message : String(erro),
            passou: false,
            houveErro: true
          });
        }
      );
    });
  });

  return cadeia.then(function () {
    const todosPassaram = resultados.length > 0 && resultados.every(function (r) { return r.passou; });
    return { ok: true, todosPassaram: todosPassaram, resultados: resultados };
  });
}

process.on('message', function (dados) {
  fecharPortas();

  rodar(dados).then(
    function (resposta) {
      responder(resposta);
      encerrar(0);
    },
    function (erro) {
      responder({
        ok: false,
        tipo: 'execucao',
        erro: (erro && erro.message) ? erro.message : String(erro)
      });
      encerrar(0);
    }
  );
});
