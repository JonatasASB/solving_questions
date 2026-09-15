/* Página de login: entrar ou criar conta.

   Ao criar conta, o perfil é configurado junto — nome, username, linguagem,
   idioma do site, ano de nascimento e sexo. Os campos vêm de Perfil.montar,
   os mesmos que a janela de configurações usa. */

(function () {
  const el = {
    abaEntrar: document.getElementById('aba-entrar'),
    abaCadastrar: document.getElementById('aba-cadastrar'),
    explicacao: document.getElementById('explicacao'),
    formulario: document.getElementById('formulario'),
    email: document.getElementById('email'),
    senha: document.getElementById('senha'),
    ajudaSenha: document.getElementById('ajuda-senha'),
    blocoPerfil: document.getElementById('bloco-perfil'),
    camposPerfil: document.getElementById('campos-perfil'),
    mensagem: document.getElementById('mensagem'),
    btnEnviar: document.getElementById('btn-enviar'),
    btnTema: document.getElementById('btn-tema'),
    seletorIdioma: document.getElementById('seletor-idioma'),
    avisoSemServidor: document.getElementById('aviso-sem-servidor')
  };

  const CHAVE_LOCAL = 'solving_questions_v1';
  let modo = 'entrar';   // 'entrar' | 'cadastrar'

  /* ------------------------------------------------------ Preferências */

  function lerLocal() {
    try {
      const bruto = localStorage.getItem(CHAVE_LOCAL);
      return bruto ? JSON.parse(bruto) : {};
    } catch (erro) {
      return {};
    }
  }

  function gravarLocal(mudancas) {
    try {
      const atual = lerLocal();
      localStorage.setItem(CHAVE_LOCAL, JSON.stringify(Object.assign(atual, mudancas)));
    } catch (erro) {
      // modo privado: vale só nesta visita
    }
  }

  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    el.btnTema.textContent = tema === 'escuro' ? '☀' : '☾';
  }

  function alternarTema() {
    const novo = document.documentElement.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro';
    aplicarTema(novo);
    gravarLocal({ tema: novo });
  }

  /* Trocar o idioma aqui remonta os campos do perfil, porque os rótulos e as
     opções deles também são traduzidos. */
  function trocarIdioma(idioma) {
    I18n.definir(idioma);
    I18n.aplicar();
    gravarLocal({ idioma: idioma });
    el.seletorIdioma.value = I18n.idioma();
    atualizarModo();
  }

  /* ------------------------------------------------------------- Modo */

  function atualizarModo() {
    const cadastrando = modo === 'cadastrar';

    el.abaEntrar.classList.toggle('aba--ativa', !cadastrando);
    el.abaCadastrar.classList.toggle('aba--ativa', cadastrando);
    el.abaEntrar.setAttribute('aria-selected', String(!cadastrando));
    el.abaCadastrar.setAttribute('aria-selected', String(cadastrando));

    el.explicacao.textContent = I18n.t(cadastrando ? 'explica_cadastrar' : 'explica_entrar');
    el.btnEnviar.textContent = I18n.t(cadastrando ? 'criar_conta' : 'entrar');
    el.senha.setAttribute('autocomplete', cadastrando ? 'new-password' : 'current-password');
    el.ajudaSenha.hidden = !cadastrando;
    el.blocoPerfil.hidden = !cadastrando;

    if (cadastrando) {
      // Preserva o que já estava digitado ao trocar de idioma.
      const jaDigitado = el.camposPerfil.children.length ? Perfil.ler(el.camposPerfil) : null;
      const inicial = Object.assign(Perfil.padrao(), { idioma: I18n.idioma() }, jaDigitado || {});
      Perfil.montar(el.camposPerfil, inicial);
    }
  }

  function trocarModo(novo) {
    modo = novo;
    esconderMensagem();
    atualizarModo();
  }

  /* --------------------------------------------------------- Mensagens */

  function mostrarErro(texto) {
    el.mensagem.textContent = texto;
    el.mensagem.className = 'aviso aviso--erro';
    el.mensagem.hidden = false;
  }

  function mostrarSucesso(texto) {
    el.mensagem.textContent = texto;
    el.mensagem.className = 'aviso aviso--certo';
    el.mensagem.hidden = false;
  }

  function esconderMensagem() {
    el.mensagem.hidden = true;
    el.mensagem.textContent = '';
  }

  /* ------------------------------------------------------------ Envio */

  async function enviar(evento) {
    evento.preventDefault();
    esconderMensagem();

    const email = el.email.value.trim();
    const senha = el.senha.value;

    if (!email || email.indexOf('@') === -1) {
      mostrarErro(I18n.t('erro_email_invalido'));
      el.email.focus();
      return;
    }
    if (!senha) {
      mostrarErro(I18n.t('senha'));
      el.senha.focus();
      return;
    }

    let perfil = null;
    if (modo === 'cadastrar') {
      if (senha.length < 8) {
        mostrarErro(I18n.t('erro_senha_curta'));
        el.senha.focus();
        return;
      }
      perfil = Perfil.ler(el.camposPerfil);
      const problema = Perfil.conferir(perfil);
      if (problema) {
        mostrarErro(I18n.t('erro_' + problema));
        const campo = el.camposPerfil.querySelector('[data-campo]');
        if (campo) campo.focus();
        return;
      }
    }

    el.btnEnviar.disabled = true;
    const rotulo = el.btnEnviar.textContent;
    el.btnEnviar.textContent = I18n.t(modo === 'cadastrar' ? 'criando' : 'entrando');

    try {
      const dados = modo === 'cadastrar'
        ? await Auth.cadastrar(email, senha, perfil)
        : await Auth.entrar(email, senha);

      // O idioma escolhido no perfil passa a valer para o site inteiro.
      if (dados.perfil && dados.perfil.idioma) gravarLocal({ idioma: dados.perfil.idioma });

      mostrarSucesso(I18n.t(modo === 'cadastrar' ? 'sucesso_cadastro' : 'sucesso_entrada'));
      setTimeout(function () { location.href = 'index.html'; }, 700);
    } catch (erro) {
      mostrarErro(I18n.erro(erro.codigo, erro.message));
      el.btnEnviar.disabled = false;
      el.btnEnviar.textContent = rotulo;
    }
  }

  /* ----------------------------------------------------------- Início */

  async function iniciar() {
    const local = lerLocal();
    I18n.definir(local.idioma || 'pt');
    I18n.aplicar();
    el.seletorIdioma.value = I18n.idioma();
    aplicarTema(local.tema === 'escuro' ? 'escuro' : 'claro');

    el.btnTema.addEventListener('click', alternarTema);
    el.seletorIdioma.addEventListener('change', function () { trocarIdioma(el.seletorIdioma.value); });
    el.abaEntrar.addEventListener('click', function () { trocarModo('entrar'); });
    el.abaCadastrar.addEventListener('click', function () { trocarModo('cadastrar'); });
    el.formulario.addEventListener('submit', enviar);
    el.email.addEventListener('input', esconderMensagem);
    el.senha.addEventListener('input', esconderMensagem);

    if (!Auth.apiDisponivel()) {
      el.avisoSemServidor.hidden = false;
      el.btnEnviar.disabled = true;
      el.email.disabled = true;
      el.senha.disabled = true;
      return;
    }

    if (Auth.logado()) {
      location.href = 'index.html';
      return;
    }

    /* A lista de linguagens do campo "linguagem principal" vem do servidor.
       Se ele não responder, Perfil usa uma lista mínima com JavaScript. */
    try {
      await Catalogo.carregar();
    } catch (erro) {
      // segue com a lista de reserva
    }

    atualizarModo();

    /* Chegou aqui por sessão vencida: diz o motivo antes de pedir a senha. */
    if (new URLSearchParams(location.search).get('expirou') === '1') {
      mostrarErro(I18n.t('sessao_expirou'));
    }

    el.email.focus();
  }

  iniciar();
})();
