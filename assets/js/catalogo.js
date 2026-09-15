/* Catálogo de questões, vindo do servidor.

   Antes as 100 questões — com testes, dicas e soluções — iam dentro do
   JavaScript da página. Agora o navegador recebe só o que precisa mostrar:
   enunciado, parâmetros e código inicial. Gabarito fica no servidor.

   As três variáveis são globais de propósito: o resto do código as usa como
   usava antes, sem precisar saber que agora chegam pela rede. */

let NIVEIS = [];
let LINGUAGENS = [];
let QUESTOES = [];

const Catalogo = (function () {

  async function carregar() {
    const resposta = await fetch('/api/questoes');
    if (!resposta.ok) throw new Error('O servidor respondeu ' + resposta.status + '.');

    const dados = await resposta.json();
    NIVEIS = dados.niveis || [];
    LINGUAGENS = dados.linguagens || [];
    QUESTOES = dados.questoes || [];

    if (QUESTOES.length === 0) throw new Error('O servidor não devolveu nenhuma questão.');
  }

  return { carregar: carregar };
})();
