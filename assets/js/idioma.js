/* Idioma da interface: português e inglês.

   Só a INTERFACE é traduzida. O conteúdo das 100 questões — enunciado,
   parâmetros, dica e explicação — continua em português, porque traduzi-lo é
   um trabalho de outra ordem de grandeza. Está registrado no README.

   Como usar:
     I18n.definir('en')                     troca o idioma
     I18n.t('enviar')                       texto simples
     I18n.t('progresso', {feitas:1, total:25, nivel:'Fácil'})   com valores
     I18n.aplicar()                         traduz o HTML marcado com data-i18n

   No HTML, marque assim:
     <button data-i18n="enviar">Enviar resposta</button>
     <input data-i18n-attr="placeholder:email_exemplo">
     <span data-i18n-attr="title:sua_pontuacao"> */

const I18n = (function () {
  const PADRAO = 'pt';
  let atual = PADRAO;

  const TEXTOS = {
    pt: {
      /* --- geral --- */
      titulo_site: 'Resolução de Questões',
      pts: 'pts',
      entrar: 'Entrar',
      sair: 'Sair',
      configuracoes: 'Configurações',
      salvar: 'Salvar',
      cancelar: 'Cancelar',
      salvando: 'Salvando…',
      alternar_tema: 'Alternar tema claro e escuro',
      sua_pontuacao: 'Sua pontuação',
      abrir_configuracoes: 'Abrir configurações',

      /* --- escolha --- */
      escolha_linguagem: 'Escolha a linguagem',
      escolha_nivel: 'Escolha o nível',
      linguagem: 'Linguagem',
      nivel: 'Nível',
      niveis: 'Níveis',
      sem_questoes_linguagem: 'Ainda não tem questões desta linguagem',

      /* --- resolução --- */
      como_responder: 'Como responder',
      sua_resposta: 'Sua resposta em JavaScript',
      enviar: 'Enviar resposta',
      corrigindo: 'Corrigindo…',
      pular: 'Pular questão',
      proxima: 'Próxima questão',
      progresso: '{feitas} de {total} questões — {nivel}',
      ja_resolvida: 'Você já resolveu esta questão.',
      tentativas_dica: '{n} tentativa(s) — dica em {faltam}',
      tentativas_solucao: '{n} tentativa(s) — solução em {faltam}',
      tentativas_simples: '{n} tentativa(s)',

      /* --- resultado --- */
      acertou: 'Parabéns! Resposta correta.',
      acertou_conta: 'Seu avanço foi computado na sua conta: <strong>+{pontos} pontos</strong>.',
      acertou_visitante: '+{pontos} pontos neste navegador. <a href="login.html">Entre com uma conta</a> para a pontuação ficar guardada.',
      ja_pontuou: 'Você já havia resolvido esta questão, então ela não soma pontos de novo.',
      errou: 'Ainda não',
      testes_passaram: '{quantos} de {total} testes passaram.',
      erro_sintaxe: 'Erro de sintaxe',
      erro_sintaxe_texto: 'O JavaScript não conseguiu nem ler seu código:',
      erro_tempo: 'Tempo esgotado',
      erro_execucao: 'Não deu para executar',
      erro_servidor: 'Sem resposta do servidor',
      editor_vazio_titulo: 'Escreva sua resposta',
      editor_vazio_texto: 'O editor está vazio.',
      dica: 'Dica',
      solucao_explicada: 'Solução explicada',
      esperado: 'esperado',
      obtido: 'obtido',

      /* --- avisos --- */
      editor_simples: 'O editor avançado não carregou (provavelmente sem internet). Você pode escrever normalmente no campo simples — a correção funciona igual.',
      progresso_visitante: 'As questões que você resolveu sem conta não entram na pontuação: só conta o que for resolvido conectado. Resolva-as de novo para pontuar.',
      sem_servidor_titulo: 'O servidor não está respondendo',
      sem_servidor_texto: 'A correção das questões acontece no servidor, então ele precisa estar rodando. No terminal, dentro da pasta do projeto:',
      sem_servidor_depois: 'Depois abra <code>http://localhost:3000</code>.',
      complete_perfil: 'Sua conta foi criada antes do perfil existir. Complete os dados para continuar.',

      /* --- login --- */
      titulo_login: 'Entrar — Resolução de Questões',
      criar_conta: 'Criar conta',
      criando: 'Criando…',
      entrando: 'Entrando…',
      explica_entrar: 'Entre para que sua pontuação fique guardada na sua conta.',
      explica_cadastrar: 'Crie sua conta e configure seu perfil. Você pode mudar tudo depois.',
      email: 'E-mail',
      senha: 'Senha',
      email_exemplo: 'voce@exemplo.com',
      senha_exemplo: 'pelo menos 8 caracteres',
      ajuda_senha: 'A senha precisa ter pelo menos 8 caracteres.',
      sem_conta: 'Continuar sem conta',
      sem_conta_nota: '— o progresso fica só neste navegador.',
      sucesso_cadastro: 'Conta criada. Levando você para as questões…',
      sucesso_entrada: 'Tudo certo. Levando você para as questões…',
      aviso_sem_servidor_login: 'Esta página está aberta sem o servidor rodando, então não há como criar conta. Rode <code>node servidor/servidor.js</code> e abra <code>http://localhost:3000</code>.',

      /* --- perfil --- */
      seu_perfil: 'Seu perfil',
      nome_completo: 'Nome completo',
      nome_completo_exemplo: 'Como você se chama',
      username: 'Nome de usuário',
      username_exemplo: 'aparece no topo da tela',
      username_ajuda: 'De 3 a 20 caracteres: letras, números, ponto, hífen ou sublinhado.',
      linguagem_principal: 'Linguagem que quer treinar',
      idioma_site: 'Idioma do site',
      ano_nascimento: 'Ano de nascimento',
      sexo: 'Sexo',
      homem: 'Homem',
      mulher: 'Mulher',
      portugues: 'Português',
      ingles: 'Inglês',
      em_breve: '(em breve)',
      perfil_salvo: 'Perfil atualizado.',

      /* --- erros vindos do servidor --- */
      erro_nome_curto: 'Digite seu nome completo.',
      erro_username_invalido: 'Nome de usuário inválido: de 3 a 20 caracteres, só letras, números, ponto, hífen ou sublinhado.',
      erro_username_em_uso: 'Este nome de usuário já está em uso.',
      erro_linguagem_invalida: 'Escolha uma linguagem da lista.',
      erro_idioma_invalido: 'Escolha um idioma da lista.',
      erro_ano_invalido: 'Ano de nascimento inválido.',
      erro_sexo_invalido: 'Escolha uma opção.',
      erro_email_invalido: 'Digite um e-mail válido.',
      erro_email_em_uso: 'Já existe uma conta com este e-mail.',
      erro_senha_curta: 'A senha precisa ter pelo menos 8 caracteres.',
      erro_senha_longa: 'A senha é longa demais.',
      erro_credenciais_invalidas: 'E-mail ou senha incorretos.',
      erro_muitas_tentativas: 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
      erro_sem_sessao: 'Sua sessão expirou. Entre novamente.',
      erro_conta_sumiu: 'Conta não encontrada.',
      erro_generico: 'Não consegui falar com o servidor.'
    },

    en: {
      titulo_site: 'Coding Questions',
      pts: 'pts',
      entrar: 'Sign in',
      sair: 'Sign out',
      configuracoes: 'Settings',
      salvar: 'Save',
      cancelar: 'Cancel',
      salvando: 'Saving…',
      alternar_tema: 'Toggle light and dark theme',
      sua_pontuacao: 'Your score',
      abrir_configuracoes: 'Open settings',

      escolha_linguagem: 'Choose the language',
      escolha_nivel: 'Choose the level',
      linguagem: 'Language',
      nivel: 'Level',
      niveis: 'Levels',
      sem_questoes_linguagem: 'No questions for this language yet',

      como_responder: 'How to answer',
      sua_resposta: 'Your answer in JavaScript',
      enviar: 'Submit answer',
      corrigindo: 'Checking…',
      pular: 'Skip question',
      proxima: 'Next question',
      progresso: '{feitas} of {total} questions — {nivel}',
      ja_resolvida: 'You have already solved this one.',
      tentativas_dica: '{n} attempt(s) — hint in {faltam}',
      tentativas_solucao: '{n} attempt(s) — solution in {faltam}',
      tentativas_simples: '{n} attempt(s)',

      acertou: 'Well done! Correct answer.',
      acertou_conta: 'Recorded in your account: <strong>+{pontos} points</strong>.',
      acertou_visitante: '+{pontos} points in this browser only. <a href="login.html">Sign in</a> to keep your score.',
      ja_pontuou: 'You had already solved this one, so it does not score again.',
      errou: 'Not yet',
      testes_passaram: '{quantos} of {total} tests passed.',
      erro_sintaxe: 'Syntax error',
      erro_sintaxe_texto: 'JavaScript could not even read your code:',
      erro_tempo: 'Time limit reached',
      erro_execucao: 'Could not run it',
      erro_servidor: 'No answer from the server',
      editor_vazio_titulo: 'Write your answer',
      editor_vazio_texto: 'The editor is empty.',
      dica: 'Hint',
      solucao_explicada: 'Solution explained',
      esperado: 'expected',
      obtido: 'got',

      editor_simples: 'The rich editor did not load (probably no internet). You can type in the plain field — checking works the same.',
      progresso_visitante: 'Questions solved without an account do not count: only what you solve while signed in scores. Solve them again to earn the points.',
      sem_servidor_titulo: 'The server is not responding',
      sem_servidor_texto: 'Questions are checked on the server, so it needs to be running. In the terminal, inside the project folder:',
      sem_servidor_depois: 'Then open <code>http://localhost:3000</code>.',
      complete_perfil: 'Your account was created before profiles existed. Please complete your details.',

      titulo_login: 'Sign in — Coding Questions',
      criar_conta: 'Create account',
      criando: 'Creating…',
      entrando: 'Signing in…',
      explica_entrar: 'Sign in so your score is kept in your account.',
      explica_cadastrar: 'Create your account and set up your profile. You can change everything later.',
      email: 'E-mail',
      senha: 'Password',
      email_exemplo: 'you@example.com',
      senha_exemplo: 'at least 8 characters',
      ajuda_senha: 'The password needs at least 8 characters.',
      sem_conta: 'Continue without an account',
      sem_conta_nota: '— progress stays in this browser only.',
      sucesso_cadastro: 'Account created. Taking you to the questions…',
      sucesso_entrada: 'All set. Taking you to the questions…',
      aviso_sem_servidor_login: 'This page is open without the server running, so accounts are unavailable. Run <code>node servidor/servidor.js</code> and open <code>http://localhost:3000</code>.',

      seu_perfil: 'Your profile',
      nome_completo: 'Full name',
      nome_completo_exemplo: 'Your name',
      username: 'Username',
      username_exemplo: 'shown at the top of the screen',
      username_ajuda: 'From 3 to 20 characters: letters, numbers, dot, hyphen or underscore.',
      linguagem_principal: 'Language you want to practise',
      idioma_site: 'Site language',
      ano_nascimento: 'Year of birth',
      sexo: 'Sex',
      homem: 'Man',
      mulher: 'Woman',
      portugues: 'Portuguese',
      ingles: 'English',
      em_breve: '(coming soon)',
      perfil_salvo: 'Profile updated.',

      erro_nome_curto: 'Enter your full name.',
      erro_username_invalido: 'Invalid username: 3 to 20 characters, only letters, numbers, dot, hyphen or underscore.',
      erro_username_em_uso: 'That username is already taken.',
      erro_linguagem_invalida: 'Pick a language from the list.',
      erro_idioma_invalido: 'Pick a language from the list.',
      erro_ano_invalido: 'Invalid year of birth.',
      erro_sexo_invalido: 'Pick one option.',
      erro_email_invalido: 'Enter a valid e-mail.',
      erro_email_em_uso: 'An account with this e-mail already exists.',
      erro_senha_curta: 'The password needs at least 8 characters.',
      erro_senha_longa: 'The password is too long.',
      erro_credenciais_invalidas: 'Wrong e-mail or password.',
      erro_muitas_tentativas: 'Too many attempts in a row. Wait a few minutes and try again.',
      erro_sem_sessao: 'Your session expired. Please sign in again.',
      erro_conta_sumiu: 'Account not found.',
      erro_generico: 'Could not reach the server.'
    }
  };

  function definir(idioma) {
    atual = TEXTOS[idioma] ? idioma : PADRAO;
    document.documentElement.setAttribute('lang', atual === 'en' ? 'en' : 'pt-BR');
  }

  function idioma() {
    return atual;
  }

  /* Troca {chave} pelos valores passados. Sem valores, devolve o texto cru. */
  function t(chave, valores) {
    const dicionario = TEXTOS[atual] || TEXTOS[PADRAO];
    let texto = dicionario[chave];

    if (texto === undefined) texto = (TEXTOS[PADRAO][chave] !== undefined ? TEXTOS[PADRAO][chave] : chave);
    if (!valores) return texto;

    return texto.replace(/\{(\w+)\}/g, function (inteiro, nome) {
      return valores[nome] !== undefined ? valores[nome] : inteiro;
    });
  }

  /* Mensagem de erro da API: prefere a tradução do código; se o código for
     desconhecido, cai na frase que o servidor mandou. */
  function erro(codigo, mensagemDoServidor) {
    const chave = 'erro_' + codigo;
    const dicionario = TEXTOS[atual] || TEXTOS[PADRAO];
    if (codigo && dicionario[chave] !== undefined) return dicionario[chave];
    return mensagemDoServidor || t('erro_generico');
  }

  /* Nome de nível vem do servidor nos dois idiomas. */
  function nomeDoNivel(nivel) {
    if (!nivel || !nivel.nome) return '';
    if (typeof nivel.nome === 'string') return nivel.nome;
    return nivel.nome[atual] || nivel.nome.pt;
  }

  /* Traduz o HTML estático marcado com data-i18n / data-i18n-attr. */
  function aplicar(raiz) {
    const alvo = raiz || document;

    alvo.querySelectorAll('[data-i18n]').forEach(function (elemento) {
      const chave = elemento.getAttribute('data-i18n');
      if (elemento.hasAttribute('data-i18n-html')) elemento.innerHTML = t(chave);
      else elemento.textContent = t(chave);
    });

    alvo.querySelectorAll('[data-i18n-attr]').forEach(function (elemento) {
      elemento.getAttribute('data-i18n-attr').split(',').forEach(function (par) {
        const partes = par.split(':');
        if (partes.length === 2) elemento.setAttribute(partes[0].trim(), t(partes[1].trim()));
      });
    });

    if (alvo === document) {
      const titulo = document.querySelector('title[data-i18n]');
      if (titulo) document.title = t(titulo.getAttribute('data-i18n'));
    }
  }

  return {
    definir: definir,
    idioma: idioma,
    t: t,
    erro: erro,
    nomeDoNivel: nomeDoNivel,
    aplicar: aplicar
  };
})();
