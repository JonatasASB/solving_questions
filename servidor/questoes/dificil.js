/* Nível difícil — 7 pontos cada.
   Métodos de iteração, funções de ordem superior, recursão e listas de objetos. */

const QUESTOES_DIFICIL = [
  {
    id: 'dificil-01',
    nivel: 'dificil',
    titulo: 'Somar só os pares',
    enunciado: 'Some apenas os números pares de uma lista.',
    parametros: 'Crie a função `somarPares`, que recebe `lista` e devolve a soma somente dos números pares. Lista vazia ou sem pares devolve 0.',
    assinatura: 'somarPares',
    modelo: 'function somarPares(lista) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 3, 4]], esperado: 6 },
      { entrada: [[1, 3, 5]], esperado: 0 },
      { entrada: [[]], esperado: 0 },
      { entrada: [[2, 4, 6, 8]], esperado: 20 }
    ],
    dica: '`filter` cria uma lista nova só com os itens que passam num teste. `reduce` junta todos os itens de uma lista em um único valor. Encadeando os dois o problema sai em uma linha — e não esqueça do valor inicial `0` no `reduce`, que é o que faz a lista vazia devolver 0.',
    solucao: 'function somarPares(lista) {\n  return lista\n    .filter(function (n) { return n % 2 === 0; })\n    .reduce(function (total, n) { return total + n; }, 0);\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      'Começa a encadear os métodos na lista.',
      '`filter` guarda só os itens cujo resto da divisão por 2 é zero, ou seja, os pares.',
      '`reduce` percorre o que sobrou somando tudo. O `0` no final é o valor de partida — é ele que garante o resultado certo quando não sobra nenhum item.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-02',
    nivel: 'dificil',
    titulo: 'Agrupar palavras por tamanho',
    enunciado: 'Organize uma lista de palavras em grupos, de acordo com a quantidade de letras de cada uma.',
    parametros: 'Crie a função `agruparPorTamanho`, que recebe `palavras` e devolve um objeto onde cada chave é um tamanho e cada valor é a lista de palavras daquele tamanho. Exemplo: `["sol", "lua", "estrela"]` vira `{ 3: ["sol", "lua"], 7: ["estrela"] }`. Lista vazia devolve objeto vazio.',
    assinatura: 'agruparPorTamanho',
    modelo: 'function agruparPorTamanho(palavras) {\n  \n}',
    testes: [
      { entrada: [['sol', 'lua', 'estrela', 'mar']], esperado: { 3: ['sol', 'lua', 'mar'], 7: ['estrela'] } },
      { entrada: [[]], esperado: {} },
      { entrada: [['oi']], esperado: { 2: ['oi'] } },
      { entrada: [['casa', 'sapo', 'pé']], esperado: { 4: ['casa', 'sapo'], 2: ['pé'] } }
    ],
    dica: '`reduce` também constrói objetos: comece com `{}` como valor inicial. Para cada palavra, use `palavra.length` como chave. O detalhe que costuma travar: se a chave ainda não existe, você precisa criar um array vazio nela antes de tentar adicionar algo.',
    solucao: 'function agruparPorTamanho(palavras) {\n  return palavras.reduce(function (grupos, palavra) {\n    const tamanho = palavra.length;\n    if (!grupos[tamanho]) {\n      grupos[tamanho] = [];\n    }\n    grupos[tamanho].push(palavra);\n    return grupos;\n  }, {});\n}',
    explicacao: [
      'Declara a função recebendo a lista de palavras.',
      '`reduce` vai montando um objeto: `grupos` é o que já foi acumulado e `palavra` é o item da vez.',
      'Guarda o tamanho da palavra, que será a chave do grupo.',
      'Pergunta se ainda não existe nada nessa chave.',
      'Se não existe, cria uma lista vazia ali. Sem isso, o `push` da linha seguinte quebraria.',
      'Fecha o `if`.',
      'Adiciona a palavra na lista do tamanho dela.',
      'Devolve o objeto acumulado para a próxima volta — o `reduce` exige esse retorno.',
      'O `{}` é o objeto de partida, usado na primeira volta e devolvido intacto quando a lista é vazia.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-03',
    nivel: 'dificil',
    titulo: 'Fatorial com recursão',
    enunciado: 'Calcule o fatorial de um número. O fatorial de 5 é 5 × 4 × 3 × 2 × 1 = 120. O fatorial de 0 é 1.',
    parametros: 'Crie a função `fatorial`, que recebe `n` e devolve o fatorial dele. Resolva usando recursão — ou seja, a função chamando ela mesma.',
    assinatura: 'fatorial',
    modelo: 'function fatorial(n) {\n  \n}',
    testes: [
      { entrada: [0], esperado: 1 },
      { entrada: [1], esperado: 1 },
      { entrada: [5], esperado: 120 },
      { entrada: [7], esperado: 5040 }
    ],
    dica: 'Toda recursão precisa de duas partes: um caso de parada, que devolve um valor sem chamar de novo, e o caso que chama a si mesmo com um número menor. Aqui a parada é quando `n` chega a 0. Sem ela, a função se chama para sempre e o navegador acusa erro de pilha.',
    solucao: 'function fatorial(n) {\n  if (n <= 1) {\n    return 1;\n  }\n  return n * fatorial(n - 1);\n}',
    explicacao: [
      'Declara a função recebendo `n`.',
      'Este é o caso de parada: quando `n` é 0 ou 1...',
      '...devolve 1 sem chamar a função de novo. É o que impede a repetição infinita.',
      'Fecha o `if`.',
      'Multiplica `n` pelo fatorial do número anterior. Cada chamada reduz `n` em 1, então a sequência sempre caminha em direção à parada.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-04',
    nivel: 'dificil',
    titulo: 'Remover duplicados',
    enunciado: 'Devolva uma lista sem itens repetidos, mantendo a ordem em que apareceram pela primeira vez.',
    parametros: 'Crie a função `removerDuplicados`, que recebe `lista` e devolve uma lista nova sem repetições. A lista original não deve ser alterada.',
    assinatura: 'removerDuplicados',
    modelo: 'function removerDuplicados(lista) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 2, 3, 1]], esperado: [1, 2, 3] },
      { entrada: [[]], esperado: [] },
      { entrada: [['a', 'a', 'b']], esperado: ['a', 'b'] },
      { entrada: [[5]], esperado: [5] }
    ],
    dica: 'Um caminho é usar `filter` com `indexOf`: um item é a primeira aparição quando a posição dele é igual à primeira posição em que ele aparece na lista. Outro caminho, bem mais curto, é usar `Set`, que é uma estrutura que não aceita valores repetidos.',
    solucao: 'function removerDuplicados(lista) {\n  return lista.filter(function (item, posicao) {\n    return lista.indexOf(item) === posicao;\n  });\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      '`filter` recebe também a posição do item, além do próprio item.',
      '`indexOf` devolve a primeira posição onde o item aparece. Se ela for igual à posição atual, esta é a primeira aparição e o item fica; nas repetições seguintes os números diferem e o item é descartado.',
      'Fecha o `filter`. Como `filter` sempre cria uma lista nova, a original continua intacta.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-05',
    nivel: 'dificil',
    titulo: 'Contar palavras repetidas',
    enunciado: 'Conte quantas vezes cada palavra aparece em uma frase.',
    parametros: 'Crie a função `contarPalavras`, que recebe `frase` e devolve um objeto onde cada chave é uma palavra e cada valor é a quantidade de vezes que ela apareceu. As palavras vêm separadas por um espaço.',
    assinatura: 'contarPalavras',
    modelo: 'function contarPalavras(frase) {\n  \n}',
    testes: [
      { entrada: ['sol sol lua mar lua sol'], esperado: { sol: 3, lua: 2, mar: 1 } },
      { entrada: ['oi'], esperado: { oi: 1 } },
      { entrada: ['a b a b a'], esperado: { a: 3, b: 2 } }
    ],
    dica: 'Primeiro quebre a frase em palavras com `split(" ")`. Depois percorra a lista montando um objeto: se a palavra ainda não está lá, comece a contagem dela em 1; se já está, some 1 ao que havia.',
    solucao: 'function contarPalavras(frase) {\n  const palavras = frase.split(" ");\n  const contagem = {};\n  palavras.forEach(function (palavra) {\n    contagem[palavra] = (contagem[palavra] || 0) + 1;\n  });\n  return contagem;\n}',
    explicacao: [
      'Declara a função recebendo a frase.',
      'Quebra a frase em uma lista de palavras, cortando nos espaços.',
      'Cria o objeto vazio que vai guardar as contagens.',
      'Percorre cada palavra da lista.',
      '`contagem[palavra] || 0` resolve a primeira aparição: quando a chave ainda não existe o valor é `undefined`, e o `||` troca por 0. Depois soma 1.',
      'Fecha o `forEach`.',
      'Devolve o objeto com as contagens.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-06',
    nivel: 'dificil',
    titulo: 'Ordenar números de verdade',
    enunciado: 'Ordene uma lista de números do menor para o maior.',
    parametros: 'Crie a função `ordenarNumeros`, que recebe `lista` e devolve uma lista ordenada do menor para o maior.',
    assinatura: 'ordenarNumeros',
    modelo: 'function ordenarNumeros(lista) {\n  \n}',
    testes: [
      { entrada: [[10, 2, 1]], esperado: [1, 2, 10] },
      { entrada: [[5, 100, 25]], esperado: [5, 25, 100] },
      { entrada: [[]], esperado: [] },
      { entrada: [[-1, -10, 5]], esperado: [-10, -1, 5] }
    ],
    dica: 'Cuidado com a armadilha clássica: `sort()` sozinho ordena como se os números fossem texto, e aí 10 vem antes de 2 porque "1" vem antes de "2". Para ordenar como número, passe uma função de comparação: `sort(function (a, b) { return a - b; })`.',
    solucao: 'function ordenarNumeros(lista) {\n  return lista.slice().sort(function (a, b) {\n    return a - b;\n  });\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      '`slice()` faz uma cópia antes de ordenar, porque `sort` altera a lista original. Em seguida ordena usando uma comparação.',
      'A subtração diz ao `sort` quem vem primeiro: negativo mantém a ordem, positivo troca. É isso que faz a ordenação ser numérica e não alfabética.',
      'Fecha o `sort`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-07',
    nivel: 'dificil',
    titulo: 'Ordenar palavras por tamanho',
    enunciado: 'Ordene uma lista de palavras da mais curta para a mais longa.',
    parametros: 'Crie a função `ordenarPorTamanho`, que recebe `palavras` e devolve a lista ordenada pela quantidade de letras, da menor para a maior.',
    assinatura: 'ordenarPorTamanho',
    modelo: 'function ordenarPorTamanho(palavras) {\n  \n}',
    testes: [
      { entrada: [['casa', 'oi', 'janela']], esperado: ['oi', 'casa', 'janela'] },
      { entrada: [['aaa', 'a', 'aa']], esperado: ['a', 'aa', 'aaa'] },
      { entrada: [[]], esperado: [] },
      { entrada: [['unica']], esperado: ['unica'] }
    ],
    dica: 'Mesma ideia de ordenar números, mas em vez de comparar os itens direto, compare o `length` de cada um: `a.length - b.length`.',
    solucao: 'function ordenarPorTamanho(palavras) {\n  return palavras.slice().sort(function (a, b) {\n    return a.length - b.length;\n  });\n}',
    explicacao: [
      'Declara a função recebendo a lista de palavras.',
      'Copia a lista e começa a ordenar.',
      'A comparação usa o tamanho de cada palavra em vez do conteúdo dela.',
      'Fecha o `sort`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-08',
    nivel: 'dificil',
    titulo: 'Filtrar maiores que um limite',
    enunciado: 'Devolva apenas os números de uma lista que são maiores que um valor dado.',
    parametros: 'Crie a função `maioresQue`, que recebe `lista` e `limite`, e devolve uma lista nova só com os itens maiores que o limite.',
    assinatura: 'maioresQue',
    modelo: 'function maioresQue(lista, limite) {\n  \n}',
    testes: [
      { entrada: [[1, 5, 10], 4], esperado: [5, 10] },
      { entrada: [[1, 2, 3], 10], esperado: [] },
      { entrada: [[]], esperado: [] },
      { entrada: [[5, 5, 6], 5], esperado: [6] }
    ],
    dica: '`filter` é feito exatamente para isso: ele percorre a lista e mantém só os itens em que a função devolve `true`. Repare no último teste: quem é igual ao limite não entra, porque a exigência é ser maior.',
    solucao: 'function maioresQue(lista, limite) {\n  return lista.filter(function (item) {\n    return item > limite;\n  });\n}',
    explicacao: [
      'Declara a função recebendo a lista e o limite.',
      '`filter` monta uma lista nova com os aprovados.',
      'A condição usa `>` puro, sem o `=`: itens iguais ao limite ficam de fora.',
      'Fecha o `filter`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-09',
    nivel: 'dificil',
    titulo: 'Dobrar todos os itens',
    enunciado: 'Devolva uma lista nova com todos os números da original multiplicados por 2.',
    parametros: 'Crie a função `dobrarTodos`, que recebe `lista` e devolve uma lista nova com cada item dobrado. A lista original não deve ser alterada.',
    assinatura: 'dobrarTodos',
    modelo: 'function dobrarTodos(lista) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 3]], esperado: [2, 4, 6] },
      { entrada: [[]], esperado: [] },
      { entrada: [[0, -5]], esperado: [0, -10] },
      { entrada: [[7]], esperado: [14] }
    ],
    dica: '`map` transforma cada item de uma lista e devolve uma lista nova do mesmo tamanho. Ele é diferente do `filter`: `filter` escolhe quem fica, `map` muda cada item.',
    solucao: 'function dobrarTodos(lista) {\n  return lista.map(function (item) {\n    return item * 2;\n  });\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      '`map` percorre item por item construindo uma lista nova, sem tocar na original.',
      'O que a função devolve vira o item correspondente na lista nova.',
      'Fecha o `map`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-10',
    nivel: 'dificil',
    titulo: 'Nomes dos aprovados',
    enunciado: 'De uma lista de alunos, devolva só os nomes dos que foram aprovados. É aprovado quem tem nota 7 ou mais.',
    parametros: 'Crie a função `nomesDosAprovados`, que recebe `alunos` — uma lista de objetos com os campos `nome` e `nota` — e devolve uma lista só com os nomes dos aprovados.',
    assinatura: 'nomesDosAprovados',
    modelo: 'function nomesDosAprovados(alunos) {\n  \n}',
    testes: [
      { entrada: [[{ nome: 'Ana', nota: 8 }, { nome: 'Bia', nota: 5 }, { nome: 'Caio', nota: 7 }]], esperado: ['Ana', 'Caio'] },
      { entrada: [[{ nome: 'Duda', nota: 3 }]], esperado: [] },
      { entrada: [[]], esperado: [] }
    ],
    dica: 'São duas operações em sequência: primeiro `filter` para separar quem passou, depois `map` para trocar cada objeto pelo nome dele. Dá para encadear um no outro.',
    solucao: 'function nomesDosAprovados(alunos) {\n  return alunos\n    .filter(function (aluno) { return aluno.nota >= 7; })\n    .map(function (aluno) { return aluno.nome; });\n}',
    explicacao: [
      'Declara a função recebendo a lista de alunos.',
      'Começa o encadeamento.',
      '`filter` mantém só os objetos com nota 7 ou mais. O `>=` inclui quem tirou exatamente 7.',
      '`map` troca cada objeto que sobrou pelo texto do nome dele.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-11',
    nivel: 'dificil',
    titulo: 'Média das idades',
    enunciado: 'Calcule a idade média de um grupo de pessoas.',
    parametros: 'Crie a função `mediaDasIdades`, que recebe `pessoas` — uma lista de objetos com o campo `idade` — e devolve a média das idades. Pode considerar que a lista nunca vem vazia.',
    assinatura: 'mediaDasIdades',
    modelo: 'function mediaDasIdades(pessoas) {\n  \n}',
    testes: [
      { entrada: [[{ idade: 20 }, { idade: 30 }]], esperado: 25 },
      { entrada: [[{ idade: 10 }]], esperado: 10 },
      { entrada: [[{ idade: 1 }, { idade: 2 }, { idade: 3 }]], esperado: 2 }
    ],
    dica: 'Use `reduce` para somar as idades, lembrando de acessar `pessoa.idade` e não a pessoa inteira. Depois divida pelo `length` da lista, fora do `reduce`.',
    solucao: 'function mediaDasIdades(pessoas) {\n  const total = pessoas.reduce(function (soma, pessoa) {\n    return soma + pessoa.idade;\n  }, 0);\n  return total / pessoas.length;\n}',
    explicacao: [
      'Declara a função recebendo a lista de pessoas.',
      '`reduce` acumula a soma; `soma` é o acumulado e `pessoa` é o objeto da vez.',
      'Soma o campo `idade` do objeto, não o objeto inteiro.',
      'O `0` é o valor inicial do acumulador.',
      'A divisão acontece depois, com o total já pronto.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-12',
    nivel: 'dificil',
    titulo: 'Agrupar produtos por categoria',
    enunciado: 'Organize uma lista de produtos em grupos por categoria, guardando só os nomes.',
    parametros: 'Crie a função `agruparPorCategoria`, que recebe `produtos` — uma lista de objetos com `nome` e `categoria` — e devolve um objeto onde cada chave é uma categoria e cada valor é a lista de nomes daquela categoria.',
    assinatura: 'agruparPorCategoria',
    modelo: 'function agruparPorCategoria(produtos) {\n  \n}',
    testes: [
      {
        entrada: [[{ nome: 'maçã', categoria: 'fruta' }, { nome: 'alface', categoria: 'verdura' }, { nome: 'uva', categoria: 'fruta' }]],
        esperado: { fruta: ['maçã', 'uva'], verdura: ['alface'] }
      },
      { entrada: [[]], esperado: {} },
      { entrada: [[{ nome: 'pão', categoria: 'padaria' }]], esperado: { padaria: ['pão'] } }
    ],
    dica: 'Mesmo padrão de agrupar palavras por tamanho, só que a chave agora vem de um campo do objeto. Não esqueça de criar a lista vazia na primeira vez que uma categoria aparece.',
    solucao: 'function agruparPorCategoria(produtos) {\n  return produtos.reduce(function (grupos, produto) {\n    if (!grupos[produto.categoria]) {\n      grupos[produto.categoria] = [];\n    }\n    grupos[produto.categoria].push(produto.nome);\n    return grupos;\n  }, {});\n}',
    explicacao: [
      'Declara a função recebendo a lista de produtos.',
      '`reduce` monta o objeto de grupos.',
      'Verifica se a categoria já tem uma lista criada.',
      'Se ainda não tem, cria a lista vazia.',
      'Fecha o `if`.',
      'Adiciona o nome do produto — só o nome, não o objeto inteiro.',
      'Devolve o acumulado para a próxima volta.',
      'O objeto vazio é o ponto de partida.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-13',
    nivel: 'dificil',
    titulo: 'Achatar listas',
    enunciado: 'Transforme uma lista de listas em uma lista só, com todos os itens em sequência.',
    parametros: 'Crie a função `achatarLista`, que recebe `listas` — uma lista onde cada item é outra lista — e devolve uma única lista com todos os itens.',
    assinatura: 'achatarLista',
    modelo: 'function achatarLista(listas) {\n  \n}',
    testes: [
      { entrada: [[[1, 2], [3], [4, 5]]], esperado: [1, 2, 3, 4, 5] },
      { entrada: [[[], []]], esperado: [] },
      { entrada: [[]], esperado: [] },
      { entrada: [[['a'], ['b', 'c']]], esperado: ['a', 'b', 'c'] }
    ],
    dica: '`concat` junta duas listas e devolve uma nova. Usando `reduce` com uma lista vazia como valor inicial, você vai concatenando uma sublista de cada vez. Também existe o método `flat()`, que faz isso pronto.',
    solucao: 'function achatarLista(listas) {\n  return listas.reduce(function (junto, atual) {\n    return junto.concat(atual);\n  }, []);\n}',
    explicacao: [
      'Declara a função recebendo a lista de listas.',
      '`junto` é o que já foi acumulado e `atual` é a sublista da vez.',
      '`concat` devolve uma lista nova com o conteúdo das duas. Diferente do `push`, ele não coloca a sublista dentro como um item só — ele espalha os itens.',
      'A lista vazia é o ponto de partida, e também a resposta quando não há nada para juntar.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-14',
    nivel: 'dificil',
    titulo: 'Itens em comum',
    enunciado: 'Descubra quais itens aparecem nas duas listas ao mesmo tempo.',
    parametros: 'Crie a função `interseccao`, que recebe `a` e `b`, e devolve uma lista com os itens que existem nas duas. Mantenha a ordem da lista `a`.',
    assinatura: 'interseccao',
    modelo: 'function interseccao(a, b) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 3], [2, 3, 4]], esperado: [2, 3] },
      { entrada: [[1, 2], [3, 4]], esperado: [] },
      { entrada: [[], [1]], esperado: [] },
      { entrada: [['x', 'y'], ['y']], esperado: ['y'] }
    ],
    dica: 'Percorra a lista `a` com `filter` e, para cada item, pergunte se a lista `b` também tem esse item usando `includes`.',
    solucao: 'function interseccao(a, b) {\n  return a.filter(function (item) {\n    return b.includes(item);\n  });\n}',
    explicacao: [
      'Declara a função recebendo as duas listas.',
      'Percorre a lista `a`, que é a que define a ordem do resultado.',
      'Mantém o item só se a lista `b` também contiver ele.',
      'Fecha o `filter`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-15',
    nivel: 'dificil',
    titulo: 'Itens que só existem na primeira',
    enunciado: 'Devolva os itens que estão na primeira lista mas não estão na segunda.',
    parametros: 'Crie a função `diferenca`, que recebe `a` e `b`, e devolve uma lista com os itens de `a` que não aparecem em `b`.',
    assinatura: 'diferenca',
    modelo: 'function diferenca(a, b) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 3], [2]], esperado: [1, 3] },
      { entrada: [[1, 2], [1, 2]], esperado: [] },
      { entrada: [[1, 2], []], esperado: [1, 2] },
      { entrada: [[], [1]], esperado: [] }
    ],
    dica: 'É o oposto dos itens em comum: mesma estrutura, mas com a condição negada. O `!` na frente inverte um `true` em `false` e vice-versa.',
    solucao: 'function diferenca(a, b) {\n  return a.filter(function (item) {\n    return !b.includes(item);\n  });\n}',
    explicacao: [
      'Declara a função recebendo as duas listas.',
      'Percorre a lista `a`.',
      'O `!` inverte a resposta do `includes`: mantém justamente os itens que `b` NÃO tem.',
      'Fecha o `filter`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-16',
    nivel: 'dificil',
    titulo: 'Anagrama',
    enunciado: 'Descubra se duas palavras são anagramas, ou seja, se usam exatamente as mesmas letras em ordens diferentes. "amor" e "roma" são anagramas.',
    parametros: 'Crie a função `ehAnagrama`, que recebe `a` e `b`, e devolve `true` se forem anagramas ou `false` se não forem.',
    assinatura: 'ehAnagrama',
    modelo: 'function ehAnagrama(a, b) {\n  \n}',
    testes: [
      { entrada: ['amor', 'roma'], esperado: true },
      { entrada: ['casa', 'saco'], esperado: false },
      { entrada: ['a', 'a'], esperado: true },
      { entrada: ['abc', 'ab'], esperado: false }
    ],
    dica: 'O truque é normalizar as duas palavras antes de comparar: quebre cada uma em letras, ordene essas letras e junte de volta. Se as duas viraram o mesmo texto, são anagramas.',
    solucao: 'function ehAnagrama(a, b) {\n  const arrumar = function (texto) {\n    return texto.split("").sort().join("");\n  };\n  return arrumar(a) === arrumar(b);\n}',
    explicacao: [
      'Declara a função recebendo as duas palavras.',
      'Cria uma função auxiliar, para não repetir o mesmo código duas vezes.',
      'Quebra em letras, ordena em ordem alfabética e junta de volta. Aqui `sort()` sem comparação funciona, porque estamos ordenando texto e não número.',
      'Fecha a função auxiliar.',
      'Se as duas palavras arrumadas ficaram idênticas, elas têm exatamente as mesmas letras.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-17',
    nivel: 'dificil',
    titulo: 'A palavra mais longa',
    enunciado: 'Encontre a palavra mais longa de uma frase. Se houver empate, devolva a primeira delas.',
    parametros: 'Crie a função `palavraMaisLonga`, que recebe `frase` e devolve a palavra com mais letras. As palavras vêm separadas por espaço.',
    assinatura: 'palavraMaisLonga',
    modelo: 'function palavraMaisLonga(frase) {\n  \n}',
    testes: [
      { entrada: ['o rato roeu a roupa'], esperado: 'roupa' },
      { entrada: ['oi'], esperado: 'oi' },
      { entrada: ['abc abcd ab'], esperado: 'abcd' },
      { entrada: ['aa bb cc'], esperado: 'aa' }
    ],
    dica: 'Quebre a frase em palavras e depois use a mesma lógica de encontrar o maior de uma lista, comparando o `length` de cada palavra. Para o empate dar a primeira, troque o campeão só quando encontrar algo estritamente maior.',
    solucao: 'function palavraMaisLonga(frase) {\n  const palavras = frase.split(" ");\n  let maior = palavras[0];\n  for (let i = 1; i < palavras.length; i++) {\n    if (palavras[i].length > maior.length) {\n      maior = palavras[i];\n    }\n  }\n  return maior;\n}',
    explicacao: [
      'Declara a função recebendo a frase.',
      'Quebra em palavras.',
      'Começa assumindo que a primeira palavra é a maior.',
      'Percorre a partir da segunda.',
      'Compara o tamanho. O `>` puro, sem o `=`, é o que resolve o empate a favor da primeira: em caso de tamanhos iguais, a troca não acontece.',
      'Troca o campeão.',
      'Fecha o `if`.',
      'Fecha o laço.',
      'Devolve a palavra vencedora.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-18',
    nivel: 'dificil',
    titulo: 'Vogais e consoantes',
    enunciado: 'Conte quantas vogais e quantas consoantes um texto tem, devolvendo os dois números juntos.',
    parametros: 'Crie a função `contarVogaisEConsoantes`, que recebe `texto` (só letras, sem espaços) e devolve um objeto no formato `{ vogais: 2, consoantes: 3 }`.',
    assinatura: 'contarVogaisEConsoantes',
    modelo: 'function contarVogaisEConsoantes(texto) {\n  \n}',
    testes: [
      { entrada: ['casa'], esperado: { vogais: 2, consoantes: 2 } },
      { entrada: ['javascript'], esperado: { vogais: 3, consoantes: 7 } },
      { entrada: [''], esperado: { vogais: 0, consoantes: 0 } },
      { entrada: ['aeiou'], esperado: { vogais: 5, consoantes: 0 } }
    ],
    dica: 'Use dois contadores e um `if/else` dentro do laço: se a letra está entre as vogais, soma num contador; se não está, soma no outro. No final, monte o objeto com os dois valores.',
    solucao: 'function contarVogaisEConsoantes(texto) {\n  let vogais = 0;\n  let consoantes = 0;\n  for (let i = 0; i < texto.length; i++) {\n    if ("aeiou".includes(texto[i].toLowerCase())) {\n      vogais++;\n    } else {\n      consoantes++;\n    }\n  }\n  return { vogais: vogais, consoantes: consoantes };\n}',
    explicacao: [
      'Declara a função recebendo o texto.',
      'Contador de vogais.',
      'Contador de consoantes.',
      'Percorre o texto letra a letra.',
      'Testa se a letra da vez é vogal, ignorando maiúsculas.',
      'É vogal: soma no primeiro contador.',
      'Não é vogal.',
      'Então é consoante: soma no segundo contador.',
      'Fecha o `if/else`.',
      'Fecha o laço.',
      'Monta e devolve o objeto com os dois números.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-19',
    nivel: 'dificil',
    titulo: 'Soma dos quadrados',
    enunciado: 'Eleve cada número de uma lista ao quadrado e some todos os resultados.',
    parametros: 'Crie a função `somaDosQuadrados`, que recebe `lista` e devolve a soma de cada item multiplicado por ele mesmo. Lista vazia devolve 0.',
    assinatura: 'somaDosQuadrados',
    modelo: 'function somaDosQuadrados(lista) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 3]], esperado: 14 },
      { entrada: [[]], esperado: 0 },
      { entrada: [[5]], esperado: 25 },
      { entrada: [[-2, 2]], esperado: 8 }
    ],
    dica: 'São duas etapas que combinam bem: `map` para elevar cada item ao quadrado e `reduce` para somar tudo. Repare que o quadrado de um negativo é positivo, então o último teste dá 8 e não 0.',
    solucao: 'function somaDosQuadrados(lista) {\n  return lista\n    .map(function (n) { return n * n; })\n    .reduce(function (total, n) { return total + n; }, 0);\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      'Começa o encadeamento.',
      '`map` troca cada item pelo quadrado dele, gerando uma lista nova do mesmo tamanho.',
      '`reduce` soma tudo, partindo de 0 — o que garante a resposta certa na lista vazia.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-20',
    nivel: 'dificil',
    titulo: 'Inverter um objeto',
    enunciado: 'Troque as chaves pelos valores de um objeto. O que era chave vira valor, e o que era valor vira chave.',
    parametros: 'Crie a função `inverterObjeto`, que recebe `objeto` e devolve um objeto novo com chaves e valores trocados. Exemplo: `{ a: 1 }` vira `{ 1: "a" }`.',
    assinatura: 'inverterObjeto',
    modelo: 'function inverterObjeto(objeto) {\n  \n}',
    testes: [
      { entrada: [{ a: 1, b: 2 }], esperado: { 1: 'a', 2: 'b' } },
      { entrada: [{}], esperado: {} },
      { entrada: [{ nome: 'ana' }], esperado: { ana: 'nome' } }
    ],
    dica: '`Object.keys(objeto)` devolve uma lista com os nomes das chaves. Percorra essa lista e, para cada chave, escreva no objeto novo usando o valor antigo como chave.',
    solucao: 'function inverterObjeto(objeto) {\n  const invertido = {};\n  Object.keys(objeto).forEach(function (chave) {\n    invertido[objeto[chave]] = chave;\n  });\n  return invertido;\n}',
    explicacao: [
      'Declara a função recebendo o objeto.',
      'Cria o objeto novo, vazio.',
      '`Object.keys` transforma as chaves em uma lista, que aí pode ser percorrida.',
      'Aqui acontece a troca: `objeto[chave]` é o valor antigo e vira a chave nova; a chave antiga vira o valor.',
      'Fecha o `forEach`.',
      'Devolve o objeto invertido.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-21',
    nivel: 'dificil',
    titulo: 'Filtrar por uma propriedade',
    enunciado: 'De uma lista de objetos, devolva só os que têm determinado valor em determinado campo.',
    parametros: 'Crie a função `filtrarPorPropriedade`, que recebe `lista`, `chave` e `valor`, e devolve os objetos em que o campo indicado por `chave` é igual a `valor`.',
    assinatura: 'filtrarPorPropriedade',
    modelo: 'function filtrarPorPropriedade(lista, chave, valor) {\n  \n}',
    testes: [
      { entrada: [[{ tipo: 'a', n: 1 }, { tipo: 'b', n: 2 }], 'tipo', 'a'], esperado: [{ tipo: 'a', n: 1 }] },
      { entrada: [[{ tipo: 'a' }, { tipo: 'a' }], 'tipo', 'a'], esperado: [{ tipo: 'a' }, { tipo: 'a' }] },
      { entrada: [[{ tipo: 'a' }], 'tipo', 'z'], esperado: [] },
      { entrada: [[], 'tipo', 'a'], esperado: [] }
    ],
    dica: 'Como o nome do campo só é conhecido na hora da execução, você precisa acessá-lo com colchetes: `item[chave]`. Escrever `item.chave` procuraria um campo chamado literalmente "chave", que não existe.',
    solucao: 'function filtrarPorPropriedade(lista, chave, valor) {\n  return lista.filter(function (item) {\n    return item[chave] === valor;\n  });\n}',
    explicacao: [
      'Declara a função recebendo a lista, o nome do campo e o valor procurado.',
      'Percorre a lista com `filter`.',
      '`item[chave]` lê o campo cujo nome está guardado na variável. É a diferença entre notação de colchetes e notação de ponto.',
      'Fecha o `filter`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-22',
    nivel: 'dificil',
    titulo: 'Ordenar por uma propriedade',
    enunciado: 'Ordene uma lista de objetos usando o valor numérico de um campo.',
    parametros: 'Crie a função `ordenarPorPropriedade`, que recebe `lista` e `chave`, e devolve a lista ordenada do menor para o maior valor daquele campo.',
    assinatura: 'ordenarPorPropriedade',
    modelo: 'function ordenarPorPropriedade(lista, chave) {\n  \n}',
    testes: [
      { entrada: [[{ n: 3 }, { n: 1 }, { n: 2 }], 'n'], esperado: [{ n: 1 }, { n: 2 }, { n: 3 }] },
      { entrada: [[{ idade: 30 }, { idade: 20 }], 'idade'], esperado: [{ idade: 20 }, { idade: 30 }] },
      { entrada: [[], 'n'], esperado: [] }
    ],
    dica: 'Junta duas ideias que você já viu: a comparação por subtração do `sort` e o acesso por colchetes para ler um campo cujo nome é variável.',
    solucao: 'function ordenarPorPropriedade(lista, chave) {\n  return lista.slice().sort(function (a, b) {\n    return a[chave] - b[chave];\n  });\n}',
    explicacao: [
      'Declara a função recebendo a lista e o nome do campo.',
      'Copia a lista antes de ordenar, para não alterar a original.',
      'Compara os dois objetos pelo campo indicado, lido com colchetes.',
      'Fecha o `sort`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-23',
    nivel: 'dificil',
    titulo: 'Contar cada caractere',
    enunciado: 'Conte quantas vezes cada letra aparece em uma palavra.',
    parametros: 'Crie a função `contarCaracteres`, que recebe `texto` e devolve um objeto onde cada chave é um caractere e cada valor é quantas vezes ele apareceu.',
    assinatura: 'contarCaracteres',
    modelo: 'function contarCaracteres(texto) {\n  \n}',
    testes: [
      { entrada: ['banana'], esperado: { b: 1, a: 3, n: 2 } },
      { entrada: [''], esperado: {} },
      { entrada: ['aa'], esperado: { a: 2 } },
      { entrada: ['abc'], esperado: { a: 1, b: 1, c: 1 } }
    ],
    dica: 'É o mesmo padrão de contar palavras repetidas, só que percorrendo letras em vez de palavras. O truque do `|| 0` continua valendo para a primeira aparição de cada letra.',
    solucao: 'function contarCaracteres(texto) {\n  const contagem = {};\n  for (let i = 0; i < texto.length; i++) {\n    const letra = texto[i];\n    contagem[letra] = (contagem[letra] || 0) + 1;\n  }\n  return contagem;\n}',
    explicacao: [
      'Declara a função recebendo o texto.',
      'Cria o objeto de contagem vazio — que também é a resposta para texto vazio.',
      'Percorre caractere por caractere.',
      'Guarda a letra da vez, só para deixar a linha seguinte mais legível.',
      'Se a letra ainda não estava no objeto, o `|| 0` começa a contagem do zero; depois soma 1.',
      'Fecha o laço.',
      'Devolve o objeto.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-24',
    nivel: 'dificil',
    titulo: 'Quem ganha mais',
    enunciado: 'De uma lista de funcionários, descubra o nome de quem tem o maior salário.',
    parametros: 'Crie a função `maiorSalario`, que recebe `funcionarios` — uma lista de objetos com `nome` e `salario` — e devolve o nome de quem ganha mais. Pode considerar que a lista nunca vem vazia.',
    assinatura: 'maiorSalario',
    modelo: 'function maiorSalario(funcionarios) {\n  \n}',
    testes: [
      { entrada: [[{ nome: 'Ana', salario: 5000 }, { nome: 'Bia', salario: 7000 }]], esperado: 'Bia' },
      { entrada: [[{ nome: 'Caio', salario: 100 }]], esperado: 'Caio' },
      { entrada: [[{ nome: 'Duda', salario: 900 }, { nome: 'Edu', salario: 300 }]], esperado: 'Duda' }
    ],
    dica: 'Mesma lógica de achar o maior de uma lista, mas guardando o objeto inteiro enquanto compara os salários. Só no final você devolve o campo `nome` do campeão — devolver o objeto inteiro não passa nos testes.',
    solucao: 'function maiorSalario(funcionarios) {\n  let campeao = funcionarios[0];\n  for (let i = 1; i < funcionarios.length; i++) {\n    if (funcionarios[i].salario > campeao.salario) {\n      campeao = funcionarios[i];\n    }\n  }\n  return campeao.nome;\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      'Começa assumindo que o primeiro é o campeão.',
      'Percorre a partir do segundo.',
      'Compara os salários, não os objetos.',
      'Encontrou alguém que ganha mais: troca o campeão.',
      'Fecha o `if`.',
      'Fecha o laço.',
      'Devolve só o nome, como o enunciado pede.',
      'Fecha a função.'
    ]
  },
  {
    id: 'dificil-25',
    nivel: 'dificil',
    titulo: 'Total do carrinho',
    enunciado: 'Calcule o valor total de um carrinho de compras. Cada item tem um preço e uma quantidade.',
    parametros: 'Crie a função `totalDoCarrinho`, que recebe `itens` — uma lista de objetos com `preco` e `quantidade` — e devolve o valor total. Carrinho vazio devolve 0.',
    assinatura: 'totalDoCarrinho',
    modelo: 'function totalDoCarrinho(itens) {\n  \n}',
    testes: [
      { entrada: [[{ preco: 10, quantidade: 2 }, { preco: 5, quantidade: 3 }]], esperado: 35 },
      { entrada: [[]], esperado: 0 },
      { entrada: [[{ preco: 99, quantidade: 1 }]], esperado: 99 },
      { entrada: [[{ preco: 10, quantidade: 0 }]], esperado: 0 }
    ],
    dica: 'Use `reduce` acumulando a soma, mas dentro dele multiplique preço por quantidade antes de somar. Um erro comum é somar só o preço e esquecer a quantidade.',
    solucao: 'function totalDoCarrinho(itens) {\n  return itens.reduce(function (total, item) {\n    return total + item.preco * item.quantidade;\n  }, 0);\n}',
    explicacao: [
      'Declara a função recebendo a lista de itens.',
      '`total` é o acumulado e `item` é o objeto da vez.',
      'Multiplica preço por quantidade antes de somar. A multiplicação acontece primeiro, sem precisar de parênteses.',
      'O `0` é o valor inicial — e a resposta para o carrinho vazio.',
      'Fecha a função.'
    ]
  }
];

module.exports = QUESTOES_DIFICIL;
