/* Correção — agora um pedido ao servidor.

   O que era um Web Worker rodando aqui virou uma chamada de API. A troca não
   é só de lugar: quem decide se a resposta está certa, quantas tentativas
   houve, e quando liberar dica e solução passou a ser o servidor. É isso que
   torna a pontuação confiável, já que o navegador não pode mais afirmar
   "acertei" por conta própria. */

const Corretor = (function () {
  const CHAVE_SESSAO = 'solving_questions_sessao';

  /* Identificador do visitante sem conta. Serve só para o servidor contar as
     tentativas dele por questão — nada aqui vale pontuação. */
  function sessao() {
    try {
      let id = localStorage.getItem(CHAVE_SESSAO);
      if (!id) {
        id = 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
        localStorage.setItem(CHAVE_SESSAO, id);
      }
      return id;
    } catch (erro) {
      return 'anonimo';
    }
  }

  /* Devolve sempre o mesmo formato que a interface já esperava:
       { ok: true,  todosPassaram, resultados, tentativas,
                    dica?, solucao?, explicacao?, progresso?, pontosDaQuestao? }
       { ok: false, tipo: 'sintaxe' | 'execucao' | 'tempo' | 'servidor', erro } */
  async function corrigir(questao, codigo) {
    const cabecalhos = {
      'Content-Type': 'application/json',
      'X-Sessao': sessao()
    };

    try {
      const token = localStorage.getItem('solving_questions_token');
      if (token) cabecalhos['Authorization'] = 'Bearer ' + token;
    } catch (erro) {
      // sem token, corrige como visitante
    }

    let resposta;
    try {
      resposta = await fetch('/api/corrigir', {
        method: 'POST',
        headers: cabecalhos,
        body: JSON.stringify({ questaoId: questao.id, codigo: codigo })
      });
    } catch (erro) {
      return {
        ok: false,
        tipo: 'servidor',
        erro: 'Não consegui falar com o servidor. Ele ainda está rodando?'
      };
    }

    let dados;
    try {
      dados = await resposta.json();
    } catch (erro) {
      return { ok: false, tipo: 'servidor', erro: 'O servidor devolveu uma resposta inesperada.' };
    }

    if (!resposta.ok) {
      return { ok: false, tipo: 'servidor', erro: dados.erro || 'O servidor recusou o pedido.' };
    }

    return dados;
  }

  return { corrigir: corrigir };
})();
