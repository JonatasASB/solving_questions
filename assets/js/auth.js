/* Cliente de autenticação.

   Conversa com a API do servidor. O site funciona sem ele: aberto direto do
   disco (file://) não há API, e o progresso fica só no navegador. */

const Auth = (function () {
  const CHAVE_TOKEN = 'solving_questions_token';

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
    let dados = {};
    try {
      dados = await resposta.json();
    } catch (erro) {
      dados = {};
    }

    if (!resposta.ok) {
      if (resposta.status === 401) limparToken();
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
  }

  return {
    apiDisponivel: apiDisponivel,
    logado: logado,
    emailAtual: emailAtual,
    cadastrar: cadastrar,
    entrar: entrar,
    carregarProgresso: carregarProgresso,
    carregarPerfil: carregarPerfil,
    salvarPerfil: salvarPerfil,
    sair: sair
  };
})();
