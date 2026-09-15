/* Persistência local — PRD 4.8.
   Guarda pontuação, questões resolvidas e tema no localStorage.
   Sem backend: o progresso é local ao navegador. */

const Armazenamento = (function () {
  const CHAVE = 'solving_questions_v1';

  const PADRAO = {
    pontos: 0,
    resolvidas: [],   // ids das questões já acertadas — alimentam o progresso de cada nível
    tema: 'claro',
    idioma: 'pt'    // idioma da interface neste aparelho
  };

  function carregar() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (!bruto) {
        return Object.assign({}, PADRAO);
      }
      const salvo = JSON.parse(bruto);
      return {
        pontos: typeof salvo.pontos === 'number' ? salvo.pontos : 0,
        resolvidas: Array.isArray(salvo.resolvidas) ? salvo.resolvidas : [],
        tema: salvo.tema === 'escuro' ? 'escuro' : 'claro',
        idioma: salvo.idioma === 'en' ? 'en' : 'pt'
      };
    } catch (erro) {
      // Navegador em modo privado ou dados corrompidos: começa do zero em vez de quebrar.
      return Object.assign({}, PADRAO);
    }
  }

  function salvar(estado) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify({
        pontos: estado.pontos,
        resolvidas: estado.resolvidas,
        tema: estado.tema,
        idioma: estado.idioma
      }));
    } catch (erro) {
      // Sem espaço ou sem permissão: a sessão continua funcionando, só não persiste.
    }
  }

  return { carregar: carregar, salvar: salvar };
})();
