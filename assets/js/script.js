/* Interface — liga a tela às regras do PRD.
   Eventos sempre por addEventListener; nada de evento inline no HTML. */

const App = (function () {

  /* PRD 4.4 — 5 falhas liberam a dica, 10 liberam a solução comentada. */
  const LIMITE_DICA = 5;
  const LIMITE_SOLUCAO = 10;

  let estado = Armazenamento.carregar();
  let perfilAtual = null;
  let linguagemAtual = null;
  let nivelAtual = null;
  let fila = [];
  let posicao = 0;
  /* O servidor é quem conta as falhas; isto guarda apenas o último número
     que ele informou, para a tela mostrar. */
  const tentativas = {};
  let corrigindo = false;

  const el = {};

  function selecionarElementos() {
    el.pontos = document.getElementById('pontos');
    el.conta = document.getElementById('conta');
    el.modal = document.getElementById('modal-config');
    el.modalFundo = document.getElementById('modal-fundo');
    el.modalNota = document.getElementById('modal-nota');
    el.modalMensagem = document.getElementById('modal-mensagem');
    el.camposConfig = document.getElementById('campos-config');
    el.btnConfigSalvar = document.getElementById('btn-config-salvar');
    el.btnConfigCancelar = document.getElementById('btn-config-cancelar');
    el.btnTema = document.getElementById('btn-tema');

    el.btnMenuLinguagem = document.getElementById('btn-menu-linguagem');
    el.listaLinguagem = document.getElementById('lista-linguagem');
    el.btnMenuNivel = document.getElementById('btn-menu-nivel');
    el.listaNivel = document.getElementById('lista-nivel');

    el.telaEscolha = document.getElementById('tela-escolha');
    el.botoesLinguagem = document.getElementById('botoes-linguagem');
    el.grupoNivel = document.getElementById('grupo-nivel');
    el.botoesNivel = document.getElementById('botoes-nivel');

    el.telaResolucao = document.getElementById('tela-resolucao');
    el.progresso = document.getElementById('progresso');
    el.barra = document.getElementById('barra');
    el.progressoTexto = document.getElementById('progresso-texto');

    el.perguntaTitulo = document.getElementById('pergunta-titulo');
    el.perguntaTexto = document.getElementById('pergunta-texto');
    el.seloNivel = document.getElementById('selo-nivel');
    el.parametrosTexto = document.getElementById('parametros-texto');

    el.editorCaixa = document.getElementById('editor-caixa');
    el.editorArea = document.getElementById('editor-area');

    el.btnEnviar = document.getElementById('btn-enviar');
    el.btnPular = document.getElementById('btn-pular');
    el.tentativas = document.getElementById('tentativas');
    el.resultado = document.getElementById('resultado');

    el.botoesNivelLateral = document.getElementById('botoes-nivel-lateral');
    el.conteudo = document.querySelector('.conteudo');
  }

  /* ------------------------------------------------------------- Texto */

  function escapar(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Converte `trecho` do enunciado em <code>trecho</code>.
  function formatar(texto) {
    return escapar(texto).replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function dadosDoNivel(id) {
    return NIVEIS.filter(function (n) { return n.id === id; })[0];
  }

  /* ------------------------------------------------------- Progresso */

  function questoesDoNivel(id) {
    return QUESTOES.filter(function (q) { return q.nivel === id; });
  }

  function resolvidasDoNivel(id) {
    return questoesDoNivel(id).filter(function (q) {
      return estado.resolvidas.indexOf(q.id) !== -1;
    }).length;
  }

  /* PRD 4.6 — a barra mede os acertos dentro do nível atual. Cada nível guarda
     o próprio progresso, então trocar de nível não zera nada. */
  function atualizarProgresso() {
    if (!nivelAtual) return;

    const total = questoesDoNivel(nivelAtual).length;
    const feitas = resolvidasDoNivel(nivelAtual);
    const fracao = total === 0 ? 0 : feitas / total;

    el.barra.style.width = (fracao * 100) + '%';
    // Vermelho (0°) no começo, verde (120°) no fim.
    el.barra.style.backgroundColor = 'hsl(' + Math.round(fracao * 120) + ', 70%, 45%)';
    el.progresso.setAttribute('aria-valuenow', Math.round(fracao * 100));

    /* O nome do nível entra inteiro: a frase não gruda preposição nele,
       então "Nível Deus" e "God Level" ficam certos sem tratamento especial. */
    el.progressoTexto.textContent = I18n.t('progresso', {
      feitas: feitas,
      total: total,
      nivel: I18n.nomeDoNivel(dadosDoNivel(nivelAtual))
    });
  }

  function atualizarPontos() {
    el.pontos.textContent = estado.pontos + ' ' + I18n.t('pts');
  }

  /* Só grava no navegador. Não existe mais rota para enviar progresso: o
     servidor atualiza a conta sozinho, ao confirmar um acerto em /api/corrigir.
     Era por essa rota que dava para enviar qualquer pontuação. */
  function salvarEstado() {
    Armazenamento.salvar(estado);
  }

  /* ----------------------------------------------------------- Tema */

  function aplicarTema() {
    const escuro = estado.tema === 'escuro';
    document.documentElement.setAttribute('data-tema', estado.tema);
    el.btnTema.textContent = escuro ? '☀' : '☾';
    Editor.aplicarTema(escuro);
  }

  function alternarTema() {
    estado.tema = estado.tema === 'escuro' ? 'claro' : 'escuro';
    salvarEstado();
    aplicarTema();
  }

  /* -------------------------------------------------------- Botões */

  function criarBotao(rotulo, aoClicar, ativo, desabilitado) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao botao--pilula' + (ativo ? ' botao--ativo' : '');
    botao.textContent = rotulo;
    botao.disabled = Boolean(desabilitado);
    if (!desabilitado) botao.addEventListener('click', aoClicar);
    return botao;
  }

  /* Botão de linguagem: pinta com a cor da marca quando a linguagem está
     disponível, e fica cinza e desabilitado enquanto não tem questões. */
  function criarBotaoLinguagem(lingua) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao botao--pilula botao--linguagem';
    botao.textContent = lingua.nome;
    botao.disabled = !lingua.ativa;

    if (lingua.ativa) {
      botao.style.backgroundColor = lingua.cor;
      botao.style.borderColor = lingua.cor;
      botao.style.color = lingua.corTexto;
      botao.addEventListener('click', function () { escolherLinguagem(lingua); });
    } else {
      botao.classList.add('botao--indisponivel');
      botao.title = I18n.t('sem_questoes_linguagem');
    }

    return botao;
  }

  function montarBotoesLinguagem() {
    el.botoesLinguagem.innerHTML = '';
    LINGUAGENS.forEach(function (lingua) {
      el.botoesLinguagem.appendChild(criarBotaoLinguagem(lingua));
    });
  }

  function montarBotoesNivel(container) {
    container.innerHTML = '';
    NIVEIS.forEach(function (nivel) {
      container.appendChild(
        criarBotao(
          I18n.nomeDoNivel(nivel) + ' · ' + nivel.pontos + ' ' + I18n.t('pts'),
          function () { escolherNivel(nivel.id); },
          nivel.id === nivelAtual,
          false
        )
      );
    });
  }

  /* ------------------------------------- Menus do header (tela pequena) */

  function fecharMenus(exceto) {
    [[el.btnMenuLinguagem, el.listaLinguagem], [el.btnMenuNivel, el.listaNivel]]
      .forEach(function (par) {
        if (par[1] === exceto) return;
        par[1].hidden = true;
        par[0].setAttribute('aria-expanded', 'false');
      });
  }

  function alternarMenu(botao, lista) {
    const abrindo = lista.hidden;
    fecharMenus(abrindo ? lista : null);
    lista.hidden = !abrindo;
    botao.setAttribute('aria-expanded', String(abrindo));
  }

  function montarMenus() {
    el.listaLinguagem.innerHTML = '';
    LINGUAGENS.forEach(function (lingua) {
      el.listaLinguagem.appendChild(itemDeMenu(
        lingua.nome,
        lingua.id === linguagemAtual,
        !lingua.ativa,
        function () { escolherLinguagem(lingua); fecharMenus(null); },
        lingua.cor
      ));
    });

    el.listaNivel.innerHTML = '';
    NIVEIS.forEach(function (nivel) {
      el.listaNivel.appendChild(itemDeMenu(
        I18n.nomeDoNivel(nivel) + ' · ' + nivel.pontos + ' ' + I18n.t('pts'),
        nivel.id === nivelAtual,
        false,
        function () { escolherNivel(nivel.id); fecharMenus(null); }
      ));
    });
  }

  function itemDeMenu(rotulo, selecionado, desabilitado, aoClicar, cor) {
    const item = document.createElement('li');
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'menu__item';

    // Ponto com a cor da linguagem, quando houver uma.
    if (cor) {
      const ponto = document.createElement('span');
      ponto.className = 'menu__cor';
      ponto.style.backgroundColor = cor;
      botao.appendChild(ponto);
      botao.appendChild(document.createTextNode(rotulo));
    } else {
      botao.textContent = rotulo;
    }

    botao.setAttribute('role', 'option');
    botao.setAttribute('aria-selected', String(Boolean(selecionado)));
    botao.disabled = Boolean(desabilitado);
    if (!desabilitado) botao.addEventListener('click', aoClicar);
    item.appendChild(botao);
    return item;
  }

  /* ------------------------------------------------------ Navegação */

  function escolherLinguagem(lingua) {
    // Só as linguagens com `ativa: true` chegam aqui; as outras têm o botão
    // desabilitado. Escolher revela a seção de níveis.
    linguagemAtual = lingua ? lingua.id : linguagemAtual;
    montarBotoesLinguagem();
    montarMenus();
    el.grupoNivel.hidden = false;
    montarBotoesNivel(el.botoesNivel);
  }

  /* PRD 4.6 — trocar de nível nunca zera o avanço. */
  function escolherNivel(id) {
    nivelAtual = id;
    montarFila();
    el.telaEscolha.hidden = true;
    el.telaResolucao.hidden = false;
    montarBotoesNivel(el.botoesNivelLateral);
    montarBotoesNivel(el.botoesNivel);
    montarMenus();
    mostrarQuestao();
    atualizarProgresso();
  }

  // Coloca as não resolvidas na frente, para o usuário não reencontrar o que já fez.
  function montarFila() {
    const doNivel = questoesDoNivel(nivelAtual);
    const pendentes = doNivel.filter(function (q) { return estado.resolvidas.indexOf(q.id) === -1; });
    const feitas = doNivel.filter(function (q) { return estado.resolvidas.indexOf(q.id) !== -1; });
    fila = pendentes.concat(feitas);
    posicao = 0;
  }

  function questaoAtual() {
    return fila[posicao];
  }

  function avancar() {
    posicao = (posicao + 1) % fila.length;
    mostrarQuestao();
  }

  /* PRD 4.7 — pular não pontua, não penaliza, devolve a questão ao fim da fila
     e zera o contador de tentativas dela. */
  function pular() {
    const questao = questaoAtual();
    if (!questao) return;
    tentativas[questao.id] = 0;
    fila.splice(posicao, 1);
    fila.push(questao);
    if (posicao >= fila.length) posicao = 0;
    mostrarQuestao();
  }

  /* ------------------------------------------------- Render da questão */

  function mostrarQuestao() {
    const questao = questaoAtual();
    if (!questao) return;

    const nivel = dadosDoNivel(questao.nivel);

    el.perguntaTitulo.textContent = questao.titulo;
    el.perguntaTexto.innerHTML = formatar(questao.enunciado);
    el.seloNivel.textContent = I18n.nomeDoNivel(nivel);
    el.parametrosTexto.innerHTML = formatar(questao.parametros);

    Editor.definirValor(questao.modelo);
    Editor.marcarErro(false);

    el.resultado.hidden = true;
    el.resultado.innerHTML = '';
    el.btnEnviar.disabled = false;
    el.btnPular.disabled = false;

    atualizarTentativas();
  }

  function atualizarTentativas() {
    const questao = questaoAtual();
    if (!questao) return;

    const falhas = tentativas[questao.id] || 0;   // informado pelo servidor
    const jaResolvida = estado.resolvidas.indexOf(questao.id) !== -1;

    if (jaResolvida && falhas === 0) {
      el.tentativas.textContent = I18n.t('ja_resolvida');
    } else if (falhas === 0) {
      el.tentativas.textContent = '';
    } else if (falhas < LIMITE_DICA) {
      el.tentativas.textContent = I18n.t('tentativas_dica', { n: falhas, faltam: LIMITE_DICA - falhas });
    } else if (falhas < LIMITE_SOLUCAO) {
      el.tentativas.textContent = I18n.t('tentativas_solucao', { n: falhas, faltam: LIMITE_SOLUCAO - falhas });
    } else {
      el.tentativas.textContent = I18n.t('tentativas_simples', { n: falhas });
    }
  }

  /* ------------------------------------------------------- Correção */

  function enviar() {
    if (corrigindo) return;
    const questao = questaoAtual();
    if (!questao) return;

    const codigo = Editor.obterValor();

    if (!codigo.trim()) {
      mostrarErro(I18n.t('editor_vazio_titulo'), I18n.t('editor_vazio_texto'));
      return;
    }

    corrigindo = true;
    el.btnEnviar.disabled = true;
    el.btnEnviar.textContent = I18n.t('corrigindo');

    Corretor.corrigir(questao, codigo).then(function (resposta) {
      corrigindo = false;
      el.btnEnviar.disabled = false;
      el.btnPular.disabled = false;
      el.btnEnviar.textContent = I18n.t('enviar');
      // tratarResposta pode voltar a travar os botões — ver registrarFalha.
      tratarResposta(questao, resposta);
    });
  }

  function tratarResposta(questao, resposta) {
    /* Servidor fora do ar não conta como tentativa errada — o usuário não fez
       nada de errado, e seria injusto gastar uma das dez chances dele. */
    if (!resposta.ok && resposta.tipo === 'servidor') {
      mostrarErro(I18n.t('erro_servidor'), resposta.erro);
      return;
    }

    if (resposta.ok && resposta.todosPassaram) {
      registrarAcerto(questao, resposta);
      return;
    }
    registrarFalha(questao, resposta);
  }

  /* PRD 4.5 — parabeniza e avisa que o avanço foi computado. */
  function registrarAcerto(questao, resposta) {
    const nivel = dadosDoNivel(questao.nivel);
    let inedita;

    if (resposta.progresso) {
      /* Conta logada: o servidor já gravou e devolveu o resultado. A tela
         apenas reflete o que ele decidiu — não calcula pontuação nenhuma. */
      inedita = resposta.inedita;
      estado.resolvidas = resposta.progresso.resolvidas;
      estado.pontos = resposta.progresso.pontos;
      Armazenamento.salvar(estado);
      atualizarPontos();
      atualizarProgresso();
    } else {
      /* Visitante sem conta: o progresso vale só neste navegador. O acerto em
         si continua sendo confirmado pelo servidor. */
      inedita = estado.resolvidas.indexOf(questao.id) === -1;
      if (inedita) {
        estado.resolvidas.push(questao.id);
        estado.pontos += (resposta.pontosDaQuestao || nivel.pontos);
        salvarEstado();
        atualizarPontos();
        atualizarProgresso();
      }
    }

    tentativas[questao.id] = 0;
    Editor.marcarErro(false);
    atualizarTentativas();

    const ganhos = resposta.pontosDaQuestao || nivel.pontos;
    let html = '<h3 class="resultado__titulo">' + I18n.t('acertou') + '</h3>';
    if (!inedita) {
      html += '<p>' + I18n.t('ja_pontuou') + '</p>';
    } else if (resposta.convidado) {
      html += '<p>' + I18n.t('acertou_visitante', { pontos: ganhos }) + '</p>';
    } else {
      html += '<p>' + I18n.t('acertou_conta', { pontos: ganhos }) + '</p>';
    }
    html += listaDeTestes(resposta.resultados);
    html += botaoProxima();

    el.resultado.className = 'resultado resultado--certo';
    el.resultado.innerHTML = html;
    el.resultado.hidden = false;
    ligarProxima();

    // A questão terminou: não há mais o que enviar nem o que pular.
    el.btnEnviar.disabled = true;
    el.btnPular.disabled = true;
  }

  function registrarFalha(questao, resposta) {
    /* O número vem do servidor. Antes era contado aqui, o que significava que
       recarregar a página devolvia as dez tentativas de volta. */
    const falhas = resposta.tentativas || 0;
    tentativas[questao.id] = falhas;

    Editor.marcarErro(true);   // deixa o código vermelho
    atualizarTentativas();

    let titulo;
    let corpo = '';

    if (!resposta.ok && resposta.tipo === 'sintaxe') {
      titulo = I18n.t('erro_sintaxe');
      corpo += '<p>' + I18n.t('erro_sintaxe_texto') + '</p>';
      corpo += '<p class="teste">' + escapar(resposta.erro) + '</p>';
    } else if (!resposta.ok && resposta.tipo === 'tempo') {
      titulo = I18n.t('erro_tempo');
      corpo += '<p>' + escapar(resposta.erro) + '</p>';
    } else if (!resposta.ok) {
      titulo = I18n.t('erro_execucao');
      corpo += '<p>' + escapar(resposta.erro) + '</p>';
    } else {
      titulo = I18n.t('errou');
      const quantos = resposta.resultados.filter(function (r) { return r.passou; }).length;
      corpo += '<p>' + I18n.t('testes_passaram', {
        quantos: quantos, total: resposta.resultados.length
      }) + '</p>';
      corpo += listaDeTestes(resposta.resultados);
    }

    /* PRD 4.4 — dica na 5ª falha, solução na 10ª. Quem decide é o servidor:
       estes campos só existem na resposta quando ele resolveu liberá-los, e é
       por isso que não adianta forjar o contador aqui. */
    if (resposta.dica) {
      corpo += '<div class="dica"><span class="dica__rotulo">' + I18n.t('dica') + '</span>' +
        formatar(resposta.dica) + '</div>';
    }

    if (resposta.solucao) {
      corpo += blocoDaSolucao(resposta.solucao, resposta.explicacao || []);
      corpo += botaoProxima();

      // Acabaram as tentativas e a resposta já foi revelada: não há mais o que
      // enviar nem o que pular. Só resta seguir para a próxima questão.
      el.btnEnviar.disabled = true;
      el.btnPular.disabled = true;
    }

    el.resultado.className = 'resultado resultado--errado';
    el.resultado.innerHTML = '<h3 class="resultado__titulo">' + titulo + '</h3>' + corpo;
    el.resultado.hidden = false;
    ligarProxima();
  }

  function blocoDaSolucao(solucao, explicacao) {
    const linhas = solucao.split('\n');
    let html = '<div class="dica"><span class="dica__rotulo">' + I18n.t('solucao_explicada') + '</span>';
    html += '<pre class="solucao__codigo">' + escapar(solucao) + '</pre>';
    html += '<ol class="solucao__linhas">';
    linhas.forEach(function (_, indice) {
      html += '<li>' + formatar(explicacao[indice] || '') + '</li>';
    });
    html += '</ol></div>';
    return html;
  }

  function listaDeTestes(resultados) {
    if (!resultados || !resultados.length) return '';
    let html = '<ul class="testes">';
    resultados.forEach(function (r) {
      const classe = r.passou ? 'teste teste--passou' : 'teste teste--falhou';
      html += '<li class="' + classe + '">';
      html += '<span class="teste__marca">' + (r.passou ? '✓' : '✗') + '</span>';
      html += escapar(r.rotulo);
      if (!r.passou) {
        html += '<div class="teste__detalhe">' + I18n.t('esperado') + ': ' + escapar(r.esperado) +
          ' · ' + I18n.t('obtido') + ': ' + escapar(r.obtido) + '</div>';
      }
      html += '</li>';
    });
    return html + '</ul>';
  }

  function botaoProxima() {
    return '<p><button type="button" class="botao botao--principal" id="btn-proxima">' +
      I18n.t('proxima') + '</button></p>';
  }

  function ligarProxima() {
    const botao = document.getElementById('btn-proxima');
    if (botao) botao.addEventListener('click', avancar);
  }

  function mostrarErro(titulo, mensagem) {
    el.resultado.className = 'resultado resultado--errado';
    el.resultado.innerHTML = '<h3 class="resultado__titulo">' + escapar(titulo) + '</h3><p>' +
      escapar(mensagem) + '</p>';
    el.resultado.hidden = false;
  }

  /* --------------------------------------------------------- Eventos */

  function ligarEventos() {
    el.btnTema.addEventListener('click', alternarTema);
    el.btnConfigSalvar.addEventListener('click', salvarConfiguracoes);
    el.btnConfigCancelar.addEventListener('click', fecharConfiguracoes);
    el.modalFundo.addEventListener('click', fecharConfiguracoes);
    el.btnEnviar.addEventListener('click', enviar);
    el.btnPular.addEventListener('click', pular);

    el.btnMenuLinguagem.addEventListener('click', function (evento) {
      evento.stopPropagation();
      alternarMenu(el.btnMenuLinguagem, el.listaLinguagem);
    });

    el.btnMenuNivel.addEventListener('click', function (evento) {
      evento.stopPropagation();
      alternarMenu(el.btnMenuNivel, el.listaNivel);
    });

    // Fecha as listas ao tocar fora ou apertar Esc.
    document.addEventListener('click', function () { fecharMenus(null); });
    document.addEventListener('keydown', function (evento) {
      if (evento.key !== 'Escape') return;
      fecharMenus(null);
      if (!el.modal.hidden) fecharConfiguracoes();
    });

    [el.listaLinguagem, el.listaNivel].forEach(function (lista) {
      lista.addEventListener('click', function (evento) { evento.stopPropagation(); });
    });
  }

  /* ---------------------------------------------- Ganchos do editor */

  function aoCarregarEditor() {
    Editor.aplicarTema(estado.tema === 'escuro');
  }

  function avisarEditorSimples() {
    const aviso = document.createElement('p');
    aviso.className = 'aviso';
    aviso.textContent = I18n.t('editor_simples');
    el.conteudo.insertBefore(aviso, el.conteudo.firstChild);
  }

  /* -------------------------------------------------------- Conta */

  /* Três estados possíveis no header:
       sem servidor  -> nada (o site abriu direto do arquivo, não há conta)
       deslogado     -> link para entrar
       logado        -> e-mail e botão de sair                              */
  function montarConta() {
    el.conta.innerHTML = '';

    if (!Auth.apiDisponivel()) return;

    if (!Auth.logado()) {
      const link = document.createElement('a');
      link.className = 'botao botao--pilula';
      link.href = 'login.html';
      link.textContent = I18n.t('entrar');
      el.conta.appendChild(link);
      return;
    }

    /* Avatar e username vêm do perfil. Enquanto ele não chegou — ou não
       existe, no caso de conta antiga — mostra o e-mail como reserva. */
    if (perfilAtual) {
      const avatar = document.createElement('img');
      avatar.className = 'conta__avatar';
      avatar.src = Perfil.avatar(perfilAtual.sexo);
      avatar.alt = '';
      avatar.width = 24;
      avatar.height = 24;
      el.conta.appendChild(avatar);
    }

    const nome = document.createElement('span');
    nome.className = 'conta__nome';
    nome.textContent = perfilAtual ? perfilAtual.username : Auth.emailAtual();
    nome.title = perfilAtual ? perfilAtual.nomeCompleto : Auth.emailAtual();
    el.conta.appendChild(nome);

    const config = document.createElement('button');
    config.type = 'button';
    config.className = 'botao botao--icone';
    config.textContent = '⚙';
    config.setAttribute('aria-label', I18n.t('abrir_configuracoes'));
    config.addEventListener('click', function () { abrirConfiguracoes(false); });
    el.conta.appendChild(config);

    const sair = document.createElement('button');
    sair.type = 'button';
    sair.className = 'botao botao--pilula';
    sair.textContent = I18n.t('sair');
    sair.addEventListener('click', encerrarSessao);
    el.conta.appendChild(sair);
  }

  /* ------------------------------------------------- Configurações */

  /* `obrigatorio` é para a conta que ainda não tem perfil: a janela abre sem
     saída, porque o cadastro precisa ser completado. */
  function abrirConfiguracoes(obrigatorio) {
    el.modalMensagem.hidden = true;
    el.modalNota.hidden = !obrigatorio;
    if (obrigatorio) el.modalNota.textContent = I18n.t('complete_perfil');

    el.btnConfigCancelar.hidden = Boolean(obrigatorio);
    el.modal.dataset.obrigatorio = obrigatorio ? 'sim' : 'nao';

    Perfil.montar(el.camposConfig, perfilAtual || Perfil.padrao());
    el.modal.hidden = false;

    const primeiro = el.camposConfig.querySelector('[data-campo]');
    if (primeiro) primeiro.focus();
  }

  function fecharConfiguracoes() {
    if (el.modal.dataset.obrigatorio === 'sim') return;   // sem perfil não há saída
    el.modal.hidden = true;
  }

  async function salvarConfiguracoes() {
    el.modalMensagem.hidden = true;

    const valores = Perfil.ler(el.camposConfig);
    const problema = Perfil.conferir(valores);
    if (problema) {
      mostrarErroNoModal(I18n.t('erro_' + problema));
      return;
    }

    el.btnConfigSalvar.disabled = true;
    const rotulo = el.btnConfigSalvar.textContent;
    el.btnConfigSalvar.textContent = I18n.t('salvando');

    try {
      perfilAtual = await Auth.salvarPerfil(valores);

      // O idioma do perfil vale para o site todo, e fica guardado no aparelho.
      estado.idioma = perfilAtual.idioma;
      Armazenamento.salvar(estado);
      aplicarIdioma(perfilAtual.idioma);

      el.modal.dataset.obrigatorio = 'nao';
      el.modal.hidden = true;
      montarConta();
    } catch (erro) {
      mostrarErroNoModal(I18n.erro(erro.codigo, erro.message));
    } finally {
      el.btnConfigSalvar.disabled = false;
      el.btnConfigSalvar.textContent = rotulo;
    }
  }

  function mostrarErroNoModal(texto) {
    el.modalMensagem.textContent = texto;
    el.modalMensagem.hidden = false;
  }

  /* Redesenha tudo que tem texto: o que está no HTML vem do data-i18n, e o
     que é montado por JavaScript precisa ser refeito. */
  function aplicarIdioma(idioma) {
    I18n.definir(idioma);
    I18n.aplicar();
    montarConta();
    montarBotoesLinguagem();
    montarMenus();
    atualizarPontos();
    if (nivelAtual) {
      montarBotoesNivel(el.botoesNivelLateral);
      montarBotoesNivel(el.botoesNivel);
      atualizarProgresso();
      mostrarQuestao();
    }
  }

  /* Sair limpa o progresso deste navegador junto com o token: os dados da
     conta continuam no servidor, e quem usar a máquina depois não herda a
     pontuação de quem saiu. */
  function encerrarSessao() {
    Auth.sair();
    perfilAtual = null;
    Armazenamento.salvar({ pontos: 0, resolvidas: [], tema: estado.tema });
    location.reload();
  }

  /* Com a correção no servidor, a conta passou a ter a única versão confiável
     do progresso — ela só cresce por acerto verificado. Por isso aqui o
     servidor substitui o estado local em vez de mesclar: aceitar o que o
     navegador diz ter resolvido reabriria justamente a porta que fechamos.

     Consequência a assumir: o que foi resolvido como visitante não migra para
     a conta. A tela avisa quando isso acontece. */
  async function sincronizar() {
    if (!Auth.logado()) return;

    const tinhaProgressoLocal = estado.resolvidas.length > 0;

    try {
      perfilAtual = await Auth.carregarPerfil();
      montarConta();

      if (perfilAtual) {
        if (perfilAtual.idioma !== I18n.idioma()) {
          estado.idioma = perfilAtual.idioma;
          aplicarIdioma(perfilAtual.idioma);
        }
      } else {
        // Conta criada antes do perfil existir: precisa completar.
        abrirConfiguracoes(true);
      }

      const doServidor = await Auth.carregarProgresso();
      if (!doServidor) return;

      const perdeuAlgo = tinhaProgressoLocal &&
        estado.resolvidas.some(function (id) {
          return (doServidor.resolvidas || []).indexOf(id) === -1;
        });

      estado = {
        resolvidas: doServidor.resolvidas || [],
        pontos: doServidor.pontos || 0,
        tema: estado.tema        // tema é preferência do aparelho, não da conta
      };
      Armazenamento.salvar(estado);

      atualizarPontos();
      atualizarProgresso();
      if (nivelAtual) {
        montarBotoesNivel(el.botoesNivelLateral);
        montarBotoesNivel(el.botoesNivel);
      }

      if (perdeuAlgo) avisarProgressoDeVisitante();
    } catch (erro) {
      // Sessão expirada ou servidor fora do ar: a tela reflete o estado real.
      montarConta();
    }
  }

  function avisarProgressoDeVisitante() {
    const aviso = document.createElement('p');
    aviso.className = 'aviso';
    aviso.textContent = I18n.t('progresso_visitante');
    el.conteudo.insertBefore(aviso, el.conteudo.firstChild);
  }

  /* Substitui a página inteira: sem catálogo não há nada para mostrar, e
     esconder isso atrás de uma tela vazia seria pior. */
  function mostrarTelaSemServidor(motivo) {
    document.querySelector('.conteudo').innerHTML =
      '<div class="cartao">' +
      '<h2 class="escolha__titulo">' + I18n.t('sem_servidor_titulo') + '</h2>' +
      '<p class="cartao__texto">' + I18n.t('sem_servidor_texto') + '</p>' +
      '<pre class="solucao__codigo">node servidor/servidor.js</pre>' +
      '<p class="cartao__texto">' + I18n.t('sem_servidor_depois') + '</p>' +
      '<p class="aviso">' + escapar(motivo) + '</p>' +
      '</div>';
  }

  /* ------------------------------------------------------- Início */

  /* A tela só existe depois que o catálogo chega. Sem servidor não há
     questões, então o lugar certo de falhar é aqui, com uma explicação. */
  async function iniciar() {
    selecionarElementos();

    /* O idioma precisa valer antes de qualquer texto aparecer, inclusive o da
       tela de erro logo abaixo. */
    I18n.definir(estado.idioma || 'pt');
    I18n.aplicar();

    try {
      await Catalogo.carregar();
    } catch (erro) {
      mostrarTelaSemServidor(erro.message);
      return;
    }

    Editor.iniciar(el.editorCaixa, el.editorArea);

    /* O vermelho serve para avisar que a tentativa falhou, não para marcar o
       código como errado para sempre: assim que o usuário volta a digitar, ele
       some e o editor recupera as cores normais. */
    Editor.aoMudar(function () {
      Editor.marcarErro(false);
    });
    ligarEventos();
    montarBotoesLinguagem();
    montarMenus();
    aplicarTema();
    atualizarPontos();
    montarConta();
    sincronizar();
  }

  return {
    iniciar: iniciar,
    aoCarregarEditor: aoCarregarEditor,
    avisarEditorSimples: avisarEditorSimples
  };
})();

App.iniciar();
