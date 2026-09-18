/* Gera o assets/vendor/codemirror.<resumo>.min.js e acerta o nome no index.html.

   Rode com: npm run build:editor

   O nome carrega um resumo do conteúdo para o arquivo poder ser servido com
   cache de um ano (servidor/servidor.js faz isso): se o conteúdo mudar, o nome
   muda junto, e o navegador busca o novo sem precisar perguntar se o que ele
   guardou ainda vale.

   Um número de versão escrito à mão não serviria aqui. O bundle junta três
   pacotes com versões próprias, então nenhum dos três números descreve o
   arquivo; e bastaria esquecer de trocá-lo uma vez para todo mundo ficar um
   ano com o editor velho em cache. O resumo do conteúdo não tem como esquecer. */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const esbuild = require('esbuild');

const PASTA = __dirname;
const RAIZ = path.join(PASTA, '..', '..');
const INDEX = path.join(RAIZ, 'index.html');

/* O mesmo padrão serve para achar o nome antigo no index.html e para varrer
   os bundles que sobraram de builds anteriores. */
const PADRAO_NOME = /codemirror\.[a-f0-9]+\.min\.js/g;

function construir() {
  const resultado = esbuild.buildSync({
    entryPoints: [path.join(PASTA, 'entrada.js')],
    bundle: true,
    format: 'esm',
    minify: true,
    target: 'es2020',
    write: false
  });
  return Buffer.from(resultado.outputFiles[0].contents);
}

function resumo(conteudo) {
  return crypto.createHash('sha256').update(conteudo).digest('hex').slice(0, 10);
}

/* Sem isso, cada build deixaria mais um bundle de 492 KB para trás. */
function limparAntigos(nomeAtual) {
  fs.readdirSync(PASTA).forEach(function (nome) {
    PADRAO_NOME.lastIndex = 0;
    if (PADRAO_NOME.test(nome) && nome !== nomeAtual) {
      fs.unlinkSync(path.join(PASTA, nome));
      console.log('removido ' + nome);
    }
  });
}

function apontarIndex(nomeAtual) {
  const antes = fs.readFileSync(INDEX, 'utf8');
  const achados = antes.match(PADRAO_NOME);

  /* Não achar nada não é "já está certo": é o index.html deixar de apontar
     para bundle nenhum. Melhor parar aqui do que publicar um site cujo editor
     busca um arquivo que não existe. */
  if (!achados) {
    console.error('Não achei nenhuma referência a codemirror.<resumo>.min.js no index.html.');
    console.error('Aponte o import para ' + nomeAtual + ' e rode de novo.');
    process.exit(1);
  }

  if (achados.every(function (achado) { return achado === nomeAtual; })) {
    console.log('index.html já aponta para ' + nomeAtual);
    return;
  }

  fs.writeFileSync(INDEX, antes.replace(PADRAO_NOME, nomeAtual));
  console.log('index.html agora aponta para ' + nomeAtual);
}

const conteudo = construir();
const nome = 'codemirror.' + resumo(conteudo) + '.min.js';

fs.writeFileSync(path.join(PASTA, nome), conteudo);
console.log(nome + '  ' + (conteudo.length / 1024).toFixed(1) + ' KB');

limparAntigos(nome);
apontarIndex(nome);
