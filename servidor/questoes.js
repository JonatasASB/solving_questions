/* Catálogo de questões — agora do lado do servidor.

   A mudança importante: `paraOCliente` decide o que o navegador recebe. Casos
   de teste, dica, solução e explicação NÃO saem daqui junto com o enunciado.
   Antes tudo isso ia no pacote JavaScript, e bastava abrir o DevTools para ler
   o gabarito antes de tentar. */

/* O nome vem nos dois idiomas; quem escolhe é a interface, conforme o perfil.
   O conteúdo das questões continua só em português — ver README. */
const NIVEIS = [
  { id: 'facil', nome: { pt: 'Fácil', en: 'Easy' }, pontos: 3 },
  { id: 'medio', nome: { pt: 'Médio', en: 'Medium' }, pontos: 5 },
  { id: 'dificil', nome: { pt: 'Difícil', en: 'Hard' }, pontos: 7 },
  { id: 'deus', nome: { pt: 'Nível Deus', en: 'God Level' }, pontos: 10 }
];

/* Cada linguagem tem a cor da própria marca, já pronta para quando as questões
   dela existirem. Enquanto `ativa` for false, o botão aparece cinza.
   Para ativar: trocar para true e acrescentar as questões em questoes/. */
const LINGUAGENS = [
  { id: 'javascript', nome: 'JavaScript', ativa: true, cor: '#f7df1e', corTexto: '#1a1a00' },
  { id: 'typescript', nome: 'TypeScript', ativa: false, cor: '#3178c6', corTexto: '#ffffff' },
  { id: 'python', nome: 'Python', ativa: false, cor: '#4b8bbe', corTexto: '#ffffff' },
  { id: 'node', nome: 'Node.js', ativa: false, cor: '#5fa04e', corTexto: '#08210b' },
  { id: 'csharp', nome: 'C#', ativa: false, cor: '#68217a', corTexto: '#ffffff' },
  { id: 'java', nome: 'Java', ativa: false, cor: '#ed8b00', corTexto: '#231400' }
];

const QUESTOES = [].concat(
  require('./questoes/facil'),
  require('./questoes/medio'),
  require('./questoes/dificil'),
  require('./questoes/deus')
);

const PORT_ID = new Map(QUESTOES.map(function (q) { return [q.id, q]; }));

/* O que o navegador precisa para mostrar a questão — e nada além disso. */
function paraOCliente(questao) {
  return {
    id: questao.id,
    nivel: questao.nivel,
    titulo: questao.titulo,
    enunciado: questao.enunciado,
    parametros: questao.parametros,
    assinatura: questao.assinatura,
    modelo: questao.modelo
  };
}

function catalogo() {
  return {
    niveis: NIVEIS,
    linguagens: LINGUAGENS,
    questoes: QUESTOES.map(paraOCliente)
  };
}

function porId(id) {
  return PORT_ID.get(id) || null;
}

function pontosDoNivel(nivelId) {
  const nivel = NIVEIS.find(function (n) { return n.id === nivelId; });
  return nivel ? nivel.pontos : 0;
}

/* Os pontos são deriváveis das questões resolvidas. Recalcular a partir delas
   é o que impede a pontuação de ser enviada pronta pelo cliente. */
function pontosDe(resolvidas) {
  return (resolvidas || []).reduce(function (total, id) {
    const questao = porId(id);
    return questao ? total + pontosDoNivel(questao.nivel) : total;
  }, 0);
}

module.exports = {
  NIVEIS: NIVEIS,
  LINGUAGENS: LINGUAGENS,
  QUESTOES: QUESTOES,
  catalogo: catalogo,
  porId: porId,
  pontosDoNivel: pontosDoNivel,
  pontosDe: pontosDe
};
