/* Perfil do usuário: o que ele informa ao criar a conta e pode mudar depois.

   A validação mora aqui, no servidor, e não na tela. O formulário confere as
   mesmas regras só para dar retorno rápido — quem decide é este arquivo.

   Os erros voltam como código (`nome_curto`, `username_em_uso`...) em vez de
   frase pronta, porque a interface existe em português e inglês e é ela quem
   escolhe o idioma da mensagem. */

const IDIOMAS = ['pt', 'en'];
const SEXOS = ['homem', 'mulher'];
const ANO_MINIMO = 1900;

function limpar(valor, maximo) {
  return String(valor === undefined || valor === null ? '' : valor).trim().slice(0, maximo);
}

/* Devolve { perfil } quando está tudo certo, ou { erro: <código> }. */
function validar(bruto, idsDeLinguagem) {
  const dados = bruto || {};

  const perfil = {
    nomeCompleto: limpar(dados.nomeCompleto, 80),
    username: limpar(dados.username, 20).toLowerCase(),
    linguagemPrincipal: limpar(dados.linguagemPrincipal, 30),
    idioma: limpar(dados.idioma, 2),
    anoNascimento: parseInt(dados.anoNascimento, 10),
    sexo: limpar(dados.sexo, 10)
  };

  if (perfil.nomeCompleto.length < 2) return { erro: 'nome_curto' };

  // Letras, números, ponto, hífen e sublinhado — é o que aparece no header.
  if (!/^[a-z0-9._-]{3,20}$/.test(perfil.username)) return { erro: 'username_invalido' };

  if (idsDeLinguagem.indexOf(perfil.linguagemPrincipal) === -1) return { erro: 'linguagem_invalida' };
  if (IDIOMAS.indexOf(perfil.idioma) === -1) return { erro: 'idioma_invalido' };

  const anoAtual = new Date().getFullYear();
  if (!Number.isInteger(perfil.anoNascimento) ||
      perfil.anoNascimento < ANO_MINIMO ||
      perfil.anoNascimento > anoAtual) {
    return { erro: 'ano_invalido' };
  }

  if (SEXOS.indexOf(perfil.sexo) === -1) return { erro: 'sexo_invalido' };

  return { perfil: perfil };
}

module.exports = {
  validar: validar,
  IDIOMAS: IDIOMAS,
  SEXOS: SEXOS,
  ANO_MINIMO: ANO_MINIMO
};
