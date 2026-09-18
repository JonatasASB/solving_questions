/* Área de resposta — PRD 3.5e e 5.

   Usa CodeMirror 6, carregado pelo módulo no fim do index.html a partir de
   assets/vendor/codemirror.min.js. Enquanto ele não chega — ou se não chegar —
   a textarea do HTML continua valendo como editor. A correção funciona nos
   dois casos. */

const Editor = (function () {
  let caixa = null;
  let area = null;          // textarea de reserva
  let vista = null;         // EditorView do CodeMirror, quando disponível
  let modulos = null;       // { EditorView, basicSetup, javascript, oneDark }
  let temaEscuro = false;
  let valorPendente = '';
  let aoMudarCallback = null;
  let mudancaProgramatica = false;   // ignora as escritas feitas pelo próprio código

  function iniciar(elementoCaixa, elementoArea) {
    caixa = elementoCaixa;
    area = elementoArea;
    valorPendente = area.value;
    area.addEventListener('input', notificarMudanca);

    /* O CodeMirror pode ter chegado antes desta chamada; se chegou, ficou
       guardado esperando a textarea existir. Este é o momento. */
    if (modulos) ativarCodeMirror(modulos);
  }

  /* Quem escuta é a interface: hoje ela usa isso para apagar o vermelho assim
     que o usuário volta a mexer no código. */
  function aoMudar(callback) {
    aoMudarCallback = callback;
  }

  function notificarMudanca() {
    if (mudancaProgramatica) return;
    if (aoMudarCallback) aoMudarCallback();
  }

  function criarVista() {
    if (vista) {
      vista.destroy();
      vista = null;
    }

    const extensoes = [
      modulos.basicSetup,
      modulos.javascript(),
      modulos.EditorView.updateListener.of(function (atualizacao) {
        if (atualizacao.docChanged) notificarMudanca();
      })
    ];

    if (temaEscuro) {
      extensoes.push(modulos.oneDark);
    }

    vista = new modulos.EditorView({
      doc: valorPendente,
      extensions: extensoes,
      parent: caixa
    });
  }

  /* Chamado pelo módulo do index.html quando o CodeMirror termina de carregar.

     Pode acontecer antes de iniciar(): o bundle é local e chega em poucos
     milissegundos, enquanto iniciar() espera o catálogo do servidor. Quando é
     esse o caso, guardar os módulos basta — iniciar() chama esta função de
     novo assim que a textarea existir. */
  function ativarCodeMirror(modulosCarregados) {
    modulos = modulosCarregados;
    if (!area) return;
    valorPendente = area.value;
    area.hidden = true;
    criarVista();
  }

  function obterValor() {
    if (vista) return vista.state.doc.toString();
    return area.value;
  }

  function definirValor(texto) {
    valorPendente = texto;
    mudancaProgramatica = true;
    area.value = texto;
    if (vista) {
      vista.dispatch({
        changes: { from: 0, to: vista.state.doc.length, insert: texto }
      });
    }
    mudancaProgramatica = false;
  }

  /* Deixa o código vermelho quando a resposta falha — exigência do dump. */
  function marcarErro(temErro) {
    caixa.classList.toggle('editor--erro', Boolean(temErro));
  }

  function aplicarTema(escuro) {
    temaEscuro = escuro;
    if (vista) {
      valorPendente = obterValor();
      criarVista();
    }
  }

  function focar() {
    if (vista) vista.focus();
    else area.focus();
  }

  return {
    iniciar: iniciar,
    aoMudar: aoMudar,
    ativarCodeMirror: ativarCodeMirror,
    obterValor: obterValor,
    definirValor: definirValor,
    marcarErro: marcarErro,
    aplicarTema: aplicarTema,
    focar: focar
  };
})();
