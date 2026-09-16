/* Cliente de autenticação.

   Conversa com a API do servidor. O site funciona sem ele: aberto direto do
   disco (file://) não há API, e o progresso fica só no navegador. */

const Auth = (function () {
  const CHAVE_TOKEN = 'solving_questions_token';
  /* Marca que existia uma sessão e ela venceu. É o que separa "nunca entrou"
     (visitante, segue livre) de "entrou e sumiu por 3 dias" (precisa informar
     e-mail e senha de novo). */
  const CHAVE_EXPIROU = 'solving_questions_sessao_expirou';
  /* Registra que a pessoa viu a tela de entrada e escolheu seguir sem
     conta. Sem isso ela voltaria para o login a cada carregamento, presa
     num ciclo de onde a opção de visitante nunca sai. */
  const CHAVE_VISITANTE = 'solving_questions_visitante';

  /* Sem servidor não há API. É o que permite abrir o index.html com duplo
     clique e continuar treinando, só que sem conta. */
  function apiDisponivel() {
    return location.protocol === 'http:' || location.protocol === 'https:';
  }

  function token() {
    try {
      return localStorage.getItem(CHAVE_TOKEN);
    } catch (erro) {
      return null;
    }
  }

  function guardarToken(valor) {
    try {
      localStorage.setItem(CHAVE_TOKEN, valor);
    } catch (erro) {
      // Modo privado: a sessão vale enquanto a aba estiver aberta.
    }
  }

  function limparToken() {
    try {
      localStorage.removeItem(CHAVE_TOKEN);
    } catch (erro) {
      // nada a fazer
    }
  }

  function escolherVisitante() {
    try {
      localStorage.setItem(CHAVE_VISITANTE, '1');
    } catch (erro) {
      // sem localStorage a escolha vale só para esta página
    }
  }

  function escolheuVisitante() {
    try {
      return localStorage.getItem(CHAVE_VISITANTE) === '1';
    } catch (erro) {
      /* Navegador sem armazenamento: melhor deixar entrar do que prender
         na tela de login alguém que não tem como registrar a escolha. */
      return true;
    }
  }

  function marcarExpirada() {
    try {
      localStorage.setItem(CHAVE_EXPIROU, '1');
    } catch (erro) {
      // sem localStorage não há o que lembrar
    }
  }

  /* Lê e apaga: a tela pergunta uma vez, mostra o aviso e não repete. */
  function sessaoExpirou() {
    try {
      const marca = localStorage.getItem(CHAVE_EXPIROU) === '1';
      if (marca) localStorage.removeItem(CHAVE_EXPIROU);
      return marca;
    } catch (erro) {
      return false;
    }
  }

  /* O conteúdo do token é legível (não é segredo) — dá para saber quem está
     logado e até quando vale sem perguntar ao servidor. Quem valida de
     verdade é o servidor, pela assinatura; isto aqui é só conveniência. */
  function dadosDoToken() {
    const bruto = token();
    if (!bruto) return null;

    const corpo = bruto.split('.')[0];
    if (!corpo) return null;

    try {
      const normal = corpo.replace(/-/g, '+').replace(/_/g, '/');
      const dados = JSON.parse(decodeURIComponent(escape(atob(normal))));
      if (!dados.expiraEm || Date.now() > dados.expiraEm) {
        marcarExpirada();
        limparToken();
        return null;
      }
      return dados;
    } catch (erro) {
      limparToken();
      return null;
    }
  }

  function logado() {
    return apiDisponivel() && dadosDoToken() !== null;
  }

  function emailAtual() {
    const dados = dadosDoToken();
    return dados ? dados.email : null;
  }

  /* Toda resposta de erro da API vira uma exceção com a mensagem que o
     servidor mandou, para a tela poder mostrá-la direto ao usuário. */
  async function pedir(caminho, metodo, corpo) {
    const opcoes = { method: metodo, headers: {} };

    const atual = token();
    if (atual) opcoes.headers['Authorization'] = 'Bearer ' + atual;

    if (corpo !== undefined) {
      opcoes.headers['Content-Type'] = 'application/json';
      opcoes.body = JSON.stringify(corpo);
    }

    const resposta = await fetch(caminho, opcoes);

    /* O servidor reinicia a janela de 3 dias a cada pedido autenticado e
       devolve o token novo neste cabeçalho. Guardar aqui, num ponto só,
       faz todas as rotas renovarem sem saber disso. */
    const renovado = resposta.headers.get('X-Token-Renovado');
    if (renovado && atual) guardarToken(renovado);

    let dados = {};
    try {
      dados = await resposta.json();
    } catch (erro) {
      dados = {};
    }

    if (!resposta.ok) {
      if (resposta.status === 401) {
        if (atual) marcarExpirada();
        limparToken();
      }
      /* O código viaja junto: a tela escolhe a frase no idioma do usuário,
         e só cai na mensagem do servidor se não conhecer o código. */
      const falha = new Error(dados.erro || 'Não consegui falar com o servidor.');
      falha.codigo = dados.codigo || null;
      throw falha;
    }
    return dados;
  }

  async function cadastrar(email, senha, perfil) {
    const dados = await pedir('/api/cadastrar', 'POST', {
      email: email,
      senha: senha,
      perfil: perfil
    });
    guardarToken(dados.token);
    return dados;
  }

  async function entrar(email, senha) {
    const dados = await pedir('/api/entrar', 'POST', { email: email, senha: senha });
    guardarToken(dados.token);
    return dados;
  }

  /* Só leitura. Não existe função para gravar progresso: quem atualiza a
     conta é o servidor, ao confirmar um acerto em /api/corrigir. */
  async function carregarProgresso() {
    if (!logado()) return null;
    const dados = await pedir('/api/progresso', 'GET');
    return dados.progresso;
  }

  /* Contas criadas antes de o perfil existir devolvem null aqui — a tela
     trata isso pedindo que o usuário complete os dados. */
  async function carregarPerfil() {
    if (!logado()) return null;
    const dados = await pedir('/api/perfil', 'GET');
    return dados.perfil;
  }

  async function salvarPerfil(perfil) {
    if (!logado()) return null;
    const dados = await pedir('/api/perfil', 'PUT', perfil);
    return dados.perfil;
  }

  function sair() {
    limparToken();
    try {
      localStorage.removeItem(CHAVE_VISITANTE);
    } catch (erro) {
      // nada a fazer
    }
  }

  return {
    apiDisponivel: apiDisponivel,
    logado: logado,
    sessaoExpirou: sessaoExpirou,
    escolherVisitante: escolherVisitante,
    escolheuVisitante: escolheuVisitante,
    emailAtual: emailAtual,
    cadastrar: cadastrar,
    entrar: entrar,
    carregarProgresso: carregarProgresso,
    carregarPerfil: carregarPerfil,
    salvarPerfil: salvarPerfil,
    sair: sair
  };
})();
