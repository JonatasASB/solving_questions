/* Campos do perfil, num lugar só.

   A tela de cadastro e a janela de configurações mostram exatamente os mesmos
   campos. Em vez de escrever o formulário duas vezes e correr o risco de eles
   divergirem, a definição vive aqui e as duas telas a usam.

   A validação daqui é só para dar retorno rápido: quem decide de verdade é
   servidor/perfil.js. */

const Perfil = (function () {

  function anoAtual() {
    return new Date().getFullYear();
  }

  function definicoes() {
    return [
      {
        nome: 'nomeCompleto',
        rotulo: 'nome_completo',
        tipo: 'texto',
        placeholder: 'nome_completo_exemplo',
        maximo: 80,
        autocomplete: 'name'
      },
      {
        nome: 'username',
        rotulo: 'username',
        tipo: 'texto',
        placeholder: 'username_exemplo',
        ajuda: 'username_ajuda',
        maximo: 20,
        autocomplete: 'username'
      },
      {
        nome: 'linguagemPrincipal',
        rotulo: 'linguagem_principal',
        tipo: 'selecao',
        opcoes: opcoesDeLinguagem
      },
      {
        nome: 'idioma',
        rotulo: 'idioma_site',
        tipo: 'selecao',
        opcoes: function () {
          return [
            { valor: 'pt', texto: I18n.t('portugues') },
            { valor: 'en', texto: I18n.t('ingles') }
          ];
        }
      },
      {
        nome: 'anoNascimento',
        rotulo: 'ano_nascimento',
        tipo: 'numero',
        minimo: 1900,
        maximo: anoAtual()
      },
      {
        nome: 'sexo',
        rotulo: 'sexo',
        tipo: 'selecao',
        opcoes: function () {
          return [
            { valor: 'homem', texto: I18n.t('homem') },
            { valor: 'mulher', texto: I18n.t('mulher') }
          ];
        }
      }
    ];
  }

  /* Linguagens sem questões continuam escolhíveis: é uma declaração de
     intenção, não uma promessa de conteúdo. O "(em breve)" deixa isso claro. */
  function opcoesDeLinguagem() {
    const lista = (typeof LINGUAGENS !== 'undefined' && LINGUAGENS.length)
      ? LINGUAGENS
      : [{ id: 'javascript', nome: 'JavaScript', ativa: true }];

    return lista.map(function (lingua) {
      return {
        valor: lingua.id,
        texto: lingua.nome + (lingua.ativa ? '' : ' ' + I18n.t('em_breve'))
      };
    });
  }

  function padrao() {
    return {
      nomeCompleto: '',
      username: '',
      linguagemPrincipal: 'javascript',
      idioma: I18n.idioma(),
      anoNascimento: '',
      sexo: 'homem'
    };
  }

  /* -------------------------------------------------------- Montagem */

  function criarCampo(definicao, valores) {
    const rotulo = document.createElement('label');
    rotulo.className = 'campo';

    const titulo = document.createElement('span');
    titulo.className = 'campo__rotulo';
    titulo.textContent = I18n.t(definicao.rotulo);
    rotulo.appendChild(titulo);

    let controle;

    if (definicao.tipo === 'selecao') {
      controle = document.createElement('select');
      definicao.opcoes().forEach(function (opcao) {
        const item = document.createElement('option');
        item.value = opcao.valor;
        item.textContent = opcao.texto;
        controle.appendChild(item);
      });
    } else {
      controle = document.createElement('input');
      controle.type = definicao.tipo === 'numero' ? 'number' : 'text';
      if (definicao.placeholder) controle.placeholder = I18n.t(definicao.placeholder);
      if (definicao.maximo && definicao.tipo === 'texto') controle.maxLength = definicao.maximo;
      if (definicao.tipo === 'numero') {
        controle.min = definicao.minimo;
        controle.max = definicao.maximo;
      }
      if (definicao.autocomplete) controle.setAttribute('autocomplete', definicao.autocomplete);
    }

    controle.id = 'perfil-' + definicao.nome;
    controle.name = definicao.nome;
    controle.dataset.campo = definicao.nome;

    const valor = valores && valores[definicao.nome] !== undefined && valores[definicao.nome] !== null
      ? valores[definicao.nome]
      : '';
    controle.value = valor;

    rotulo.appendChild(controle);

    if (definicao.ajuda) {
      const ajuda = document.createElement('span');
      ajuda.className = 'campo__ajuda';
      ajuda.textContent = I18n.t(definicao.ajuda);
      rotulo.appendChild(ajuda);
    }

    return rotulo;
  }

  function montar(container, valores) {
    const dados = Object.assign(padrao(), valores || {});
    container.innerHTML = '';
    definicoes().forEach(function (definicao) {
      container.appendChild(criarCampo(definicao, dados));
    });
  }

  function ler(container) {
    const valores = {};
    definicoes().forEach(function (definicao) {
      const controle = container.querySelector('[data-campo="' + definicao.nome + '"]');
      if (!controle) return;
      valores[definicao.nome] = definicao.tipo === 'numero'
        ? parseInt(controle.value, 10)
        : controle.value.trim();
    });
    if (valores.username) valores.username = valores.username.toLowerCase();
    return valores;
  }

  /* Mesmas regras de servidor/perfil.js, para o erro aparecer antes da viagem
     de rede. Devolve o código do problema, ou null quando está tudo certo. */
  function conferir(valores) {
    if (!valores.nomeCompleto || valores.nomeCompleto.length < 2) return 'nome_curto';
    if (!/^[a-z0-9._-]{3,20}$/.test(valores.username || '')) return 'username_invalido';
    if (!valores.linguagemPrincipal) return 'linguagem_invalida';
    if (['pt', 'en'].indexOf(valores.idioma) === -1) return 'idioma_invalido';
    if (!Number.isInteger(valores.anoNascimento) ||
        valores.anoNascimento < 1900 ||
        valores.anoNascimento > anoAtual()) return 'ano_invalido';
    if (['homem', 'mulher'].indexOf(valores.sexo) === -1) return 'sexo_invalido';
    return null;
  }

  /* Avatar do header, conforme o sexo informado. */
  function avatar(sexo) {
    return sexo === 'mulher'
      ? 'assets/images/avatar-mulher.svg'
      : 'assets/images/avatar-homem.svg';
  }

  return {
    montar: montar,
    ler: ler,
    conferir: conferir,
    padrao: padrao,
    avatar: avatar
  };
})();
