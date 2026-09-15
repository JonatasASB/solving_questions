/* Nível médio — 5 pontos cada.
   Combina condicional com repetição; manipulação de texto e de lista. */

const QUESTOES_MEDIO = [
  {
    id: 'medio-01',
    nivel: 'medio',
    titulo: 'Contar vogais',
    enunciado: 'Conte quantas vogais existem em um texto. Maiúsculas contam também.',
    parametros: 'Crie a função `contarVogais`, que recebe `texto` e devolve a quantidade de vogais encontradas (a, e, i, o, u).',
    assinatura: 'contarVogais',
    modelo: 'function contarVogais(texto) {\n  \n}',
    testes: [
      { entrada: ['banana'], esperado: 3 },
      { entrada: ['JavaScript'], esperado: 3 },
      { entrada: ['xyz'], esperado: 0 },
      { entrada: ['AEIOU'], esperado: 5 }
    ],
    dica: 'Percorra o texto letra por letra com um laço. Antes de comparar, transforme a letra em minúscula com `toLowerCase()`, senão as maiúsculas escapam da contagem.',
    solucao: 'function contarVogais(texto) {\n  const vogais = "aeiou";\n  let total = 0;\n  for (let i = 0; i < texto.length; i++) {\n    if (vogais.includes(texto[i].toLowerCase())) {\n      total++;\n    }\n  }\n  return total;\n}',
    explicacao: [
      'Declara a função recebendo `texto`.',
      'Guarda as vogais em um texto só, para poder consultar depois.',
      'Cria o contador começando em zero. Ele precisa ser `let` porque vai mudar.',
      'Percorre o texto do primeiro ao último caractere.',
      'Pega a letra da posição atual, deixa minúscula e pergunta se ela está entre as vogais.',
      'Se estiver, soma 1 ao contador.',
      'Fecha o `if`.',
      'Fecha o laço.',
      'Devolve o total contado.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-02',
    nivel: 'medio',
    titulo: 'Inverter um texto',
    enunciado: 'Devolva um texto escrito de trás para frente.',
    parametros: 'Crie a função `inverter`, que recebe `texto` e devolve o mesmo texto na ordem inversa. Texto vazio devolve texto vazio.',
    assinatura: 'inverter',
    modelo: 'function inverter(texto) {\n  \n}',
    testes: [
      { entrada: ['abc'], esperado: 'cba' },
      { entrada: ['JavaScript'], esperado: 'tpircSavaJ' },
      { entrada: [''], esperado: '' },
      { entrada: ['a'], esperado: 'a' }
    ],
    dica: 'Existem dois caminhos. Um é percorrer o texto do fim para o começo com um laço, montando o resultado. O outro é transformar o texto em lista com `split("")`, usar `reverse()` e juntar de volta com `join("")`.',
    solucao: 'function inverter(texto) {\n  return texto.split("").reverse().join("");\n}',
    explicacao: [
      'Declara a função recebendo `texto`.',
      '`split("")` quebra o texto em uma lista de letras, `reverse()` vira a lista de ponta-cabeça e `join("")` cola tudo de volta em um texto só.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-03',
    nivel: 'medio',
    titulo: 'Somar de 1 até N',
    enunciado: 'Some todos os números inteiros de 1 até um número dado.',
    parametros: 'Crie a função `somaAte`, que recebe `n` e devolve a soma de 1 + 2 + 3 ... até `n`. Se `n` for 0, o resultado é 0.',
    assinatura: 'somaAte',
    modelo: 'function somaAte(n) {\n  \n}',
    testes: [
      { entrada: [5], esperado: 15 },
      { entrada: [1], esperado: 1 },
      { entrada: [10], esperado: 55 },
      { entrada: [0], esperado: 0 }
    ],
    dica: 'Crie um acumulador em zero e use um `for` que começa em 1 e vai até `n`, somando o valor da vez. Repare que, se `n` for 0, o laço simplesmente não roda — e o acumulador continua zero, que é a resposta certa.',
    solucao: 'function somaAte(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n  return total;\n}',
    explicacao: [
      'Declara a função recebendo `n`.',
      'Cria o acumulador em zero.',
      'Começa em 1 e repete enquanto `i` for menor ou igual a `n`. O `<=` é importante: com `<`, o próprio `n` ficaria de fora.',
      '`total += i` é o mesmo que `total = total + i`.',
      'Fecha o laço.',
      'Devolve a soma acumulada.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-04',
    nivel: 'medio',
    titulo: 'Palíndromo',
    enunciado: 'Descubra se uma palavra é igual lida de trás para frente.',
    parametros: 'Crie a função `ehPalindromo`, que recebe `texto` e devolve `true` se ele for igual ao contrário de si mesmo, ou `false` se não for.',
    assinatura: 'ehPalindromo',
    modelo: 'function ehPalindromo(texto) {\n  \n}',
    testes: [
      { entrada: ['arara'], esperado: true },
      { entrada: ['banana'], esperado: false },
      { entrada: ['a'], esperado: true },
      { entrada: ['osso'], esperado: true }
    ],
    dica: 'Monte a versão invertida do texto e compare com o original usando `===`. O resultado dessa comparação já é `true` ou `false` — dá para devolver direto, sem `if`.',
    solucao: 'function ehPalindromo(texto) {\n  const invertido = texto.split("").reverse().join("");\n  return texto === invertido;\n}',
    explicacao: [
      'Declara a função recebendo `texto`.',
      'Monta a versão invertida: quebra em letras, inverte a ordem e junta de volta.',
      'Compara os dois. A comparação já vale `true` ou `false`, então devolve direto.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-05',
    nivel: 'medio',
    titulo: 'O maior da lista',
    enunciado: 'Encontre o maior número dentro de uma lista.',
    parametros: 'Crie a função `maiorDaLista`, que recebe `lista` (uma lista de números) e devolve o maior valor dela. Pode considerar que a lista nunca vem vazia.',
    assinatura: 'maiorDaLista',
    modelo: 'function maiorDaLista(lista) {\n  \n}',
    testes: [
      { entrada: [[3, 9, 2]], esperado: 9 },
      { entrada: [[-5, -1, -9]], esperado: -1 },
      { entrada: [[7]], esperado: 7 },
      { entrada: [[1, 2, 3, 4, 5]], esperado: 5 }
    ],
    dica: 'Comece assumindo que o maior é o primeiro item da lista e percorra o resto comparando. Cuidado com o atalho de começar do zero: na lista só de negativos, zero venceria todos e a resposta sairia errada.',
    solucao: 'function maiorDaLista(lista) {\n  let maior = lista[0];\n  for (let i = 1; i < lista.length; i++) {\n    if (lista[i] > maior) {\n      maior = lista[i];\n    }\n  }\n  return maior;\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      'Assume que o primeiro item é o maior até prova em contrário. Partir de um item real da lista evita o problema dos números negativos.',
      'Percorre a partir do segundo item — o primeiro já está guardado.',
      'Se o item da vez for maior que o guardado...',
      '...ele passa a ser o novo maior.',
      'Fecha o `if`.',
      'Fecha o laço.',
      'Devolve o maior encontrado.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-06',
    nivel: 'medio',
    titulo: 'Contar uma letra específica',
    enunciado: 'Conte quantas vezes uma letra aparece em um texto. Maiúsculas e minúsculas contam como a mesma letra.',
    parametros: 'Crie a função `contarLetra`, que recebe `texto` e `letra`, e devolve quantas vezes essa letra aparece.',
    assinatura: 'contarLetra',
    modelo: 'function contarLetra(texto, letra) {\n  \n}',
    testes: [
      { entrada: ['banana', 'a'], esperado: 3 },
      { entrada: ['Banana', 'b'], esperado: 1 },
      { entrada: ['casa', 'z'], esperado: 0 },
      { entrada: ['', 'a'], esperado: 0 }
    ],
    dica: 'Percorra o texto comparando cada caractere com a letra procurada. Para ignorar maiúsculas, deixe os dois lados em minúsculo antes de comparar.',
    solucao: 'function contarLetra(texto, letra) {\n  let total = 0;\n  for (let i = 0; i < texto.length; i++) {\n    if (texto[i].toLowerCase() === letra.toLowerCase()) {\n      total++;\n    }\n  }\n  return total;\n}',
    explicacao: [
      'Declara a função recebendo o texto e a letra procurada.',
      'Cria o contador em zero.',
      'Percorre o texto caractere por caractere.',
      'Compara os dois em minúsculo. Baixar os dois lados é o que faz "Banana" com "b" encontrar o "B" maiúsculo.',
      'Achou: soma 1.',
      'Fecha o `if`.',
      'Fecha o laço.',
      'Devolve o total.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-07',
    nivel: 'medio',
    titulo: 'Tabuada',
    enunciado: 'Monte a tabuada de um número, de 1 a 10, devolvendo só os resultados.',
    parametros: 'Crie a função `tabuada`, que recebe `numero` e devolve uma lista com os 10 resultados, do número vezes 1 até o número vezes 10.',
    assinatura: 'tabuada',
    modelo: 'function tabuada(numero) {\n  \n}',
    testes: [
      { entrada: [5], esperado: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50] },
      { entrada: [1], esperado: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { entrada: [0], esperado: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
    ],
    dica: 'Crie uma lista vazia e use um `for` de 1 a 10. A cada volta, use `push` para adicionar o resultado da multiplicação na lista.',
    solucao: 'function tabuada(numero) {\n  const resultados = [];\n  for (let i = 1; i <= 10; i++) {\n    resultados.push(numero * i);\n  }\n  return resultados;\n}',
    explicacao: [
      'Declara a função recebendo o número.',
      'Cria a lista vazia que vai receber os resultados.',
      'Vai de 1 até 10. O `<=` garante que o 10 entra.',
      '`push` adiciona o resultado da multiplicação no fim da lista.',
      'Fecha o laço.',
      'Devolve a lista pronta.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-08',
    nivel: 'medio',
    titulo: 'FizzBuzz',
    enunciado: 'Monte uma lista de 1 até N, trocando alguns números por texto: múltiplos de 3 viram "Fizz", múltiplos de 5 viram "Buzz", e múltiplos de 3 e 5 ao mesmo tempo viram "FizzBuzz".',
    parametros: 'Crie a função `fizzBuzz`, que recebe `n` e devolve uma lista com os valores de 1 até `n`, já com as trocas aplicadas.',
    assinatura: 'fizzBuzz',
    modelo: 'function fizzBuzz(n) {\n  \n}',
    testes: [
      { entrada: [5], esperado: [1, 2, 'Fizz', 4, 'Buzz'] },
      { entrada: [15], esperado: [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz'] },
      { entrada: [2], esperado: [1, 2] },
      { entrada: [0], esperado: [] }
    ],
    dica: 'A ordem dos testes é o que decide tudo: verifique primeiro se é múltiplo de 3 E de 5 ao mesmo tempo. Se você testar o 3 sozinho antes, o número 15 vira "Fizz" e nunca chega em "FizzBuzz".',
    solucao: 'function fizzBuzz(n) {\n  const lista = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 3 === 0 && i % 5 === 0) {\n      lista.push("FizzBuzz");\n    } else if (i % 3 === 0) {\n      lista.push("Fizz");\n    } else if (i % 5 === 0) {\n      lista.push("Buzz");\n    } else {\n      lista.push(i);\n    }\n  }\n  return lista;\n}',
    explicacao: [
      'Declara a função recebendo `n`.',
      'Cria a lista vazia.',
      'Vai de 1 até `n`. Se `n` for 0, o laço não roda e a lista sai vazia.',
      'O caso mais específico primeiro: múltiplo dos dois ao mesmo tempo.',
      'Adiciona "FizzBuzz".',
      'Só chega aqui se não for múltiplo dos dois. Testa o 3 sozinho.',
      'Adiciona "Fizz".',
      'Testa o 5 sozinho.',
      'Adiciona "Buzz".',
      'Nenhum dos casos anteriores.',
      'Adiciona o próprio número.',
      'Fecha o encadeamento de `if`.',
      'Fecha o laço.',
      'Devolve a lista.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-09',
    nivel: 'medio',
    titulo: 'Contar números pares',
    enunciado: 'Conte quantos números pares existem em uma lista.',
    parametros: 'Crie a função `contarPares`, que recebe `lista` e devolve quantos números pares ela tem. Lista vazia devolve 0.',
    assinatura: 'contarPares',
    modelo: 'function contarPares(lista) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 3, 4]], esperado: 2 },
      { entrada: [[1, 3, 5]], esperado: 0 },
      { entrada: [[]], esperado: 0 },
      { entrada: [[2, 4, 6, 8]], esperado: 4 }
    ],
    dica: 'Percorra a lista com um laço e, para cada item, teste se o resto da divisão por 2 é zero. Se for, some 1 no contador.',
    solucao: 'function contarPares(lista) {\n  let total = 0;\n  for (let i = 0; i < lista.length; i++) {\n    if (lista[i] % 2 === 0) {\n      total++;\n    }\n  }\n  return total;\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      'Contador em zero.',
      'Percorre a lista inteira. Em lista vazia, o laço não roda nenhuma vez.',
      'Testa se o item da vez é par.',
      'Se for, soma 1.',
      'Fecha o `if`.',
      'Fecha o laço.',
      'Devolve o total.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-10',
    nivel: 'medio',
    titulo: 'Somar todos os itens',
    enunciado: 'Some todos os números de uma lista.',
    parametros: 'Crie a função `somarLista`, que recebe `lista` e devolve a soma de todos os itens. Lista vazia devolve 0.',
    assinatura: 'somarLista',
    modelo: 'function somarLista(lista) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 3]], esperado: 6 },
      { entrada: [[]], esperado: 0 },
      { entrada: [[10]], esperado: 10 },
      { entrada: [[-5, 5]], esperado: 0 }
    ],
    dica: 'Crie um acumulador em zero e vá somando item por item dentro de um laço. Começar em zero é o que faz a lista vazia devolver 0 sem nenhum tratamento especial.',
    solucao: 'function somarLista(lista) {\n  let total = 0;\n  for (let i = 0; i < lista.length; i++) {\n    total += lista[i];\n  }\n  return total;\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      'Acumulador em zero — também é a resposta certa quando a lista é vazia.',
      'Percorre todos os itens.',
      'Soma o item da vez ao acumulador.',
      'Fecha o laço.',
      'Devolve a soma.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-11',
    nivel: 'medio',
    titulo: 'O menor da lista',
    enunciado: 'Encontre o menor número dentro de uma lista.',
    parametros: 'Crie a função `menorDaLista`, que recebe `lista` e devolve o menor valor dela. Pode considerar que a lista nunca vem vazia.',
    assinatura: 'menorDaLista',
    modelo: 'function menorDaLista(lista) {\n  \n}',
    testes: [
      { entrada: [[3, 9, 2]], esperado: 2 },
      { entrada: [[-5, -1, -9]], esperado: -9 },
      { entrada: [[7]], esperado: 7 },
      { entrada: [[100, 50, 75]], esperado: 50 }
    ],
    dica: 'Mesma ideia do maior da lista, mas com a comparação virada: comece pelo primeiro item e troque quando encontrar algo menor.',
    solucao: 'function menorDaLista(lista) {\n  let menor = lista[0];\n  for (let i = 1; i < lista.length; i++) {\n    if (lista[i] < menor) {\n      menor = lista[i];\n    }\n  }\n  return menor;\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      'Começa assumindo que o primeiro item é o menor.',
      'Percorre a partir do segundo.',
      'Se encontrar algo menor que o guardado...',
      '...esse passa a ser o novo menor.',
      'Fecha o `if`.',
      'Fecha o laço.',
      'Devolve o menor encontrado.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-12',
    nivel: 'medio',
    titulo: 'Média de uma lista',
    enunciado: 'Calcule a média dos números de uma lista.',
    parametros: 'Crie a função `mediaDaLista`, que recebe `lista` e devolve a média dos valores. Pode considerar que a lista nunca vem vazia.',
    assinatura: 'mediaDaLista',
    modelo: 'function mediaDaLista(lista) {\n  \n}',
    testes: [
      { entrada: [[2, 4, 6]], esperado: 4 },
      { entrada: [[10]], esperado: 10 },
      { entrada: [[1, 2]], esperado: 1.5 },
      { entrada: [[0, 0, 0]], esperado: 0 }
    ],
    dica: 'São dois passos: primeiro some tudo com um laço, depois divida pela quantidade de itens. A quantidade você pega com `lista.length`.',
    solucao: 'function mediaDaLista(lista) {\n  let total = 0;\n  for (let i = 0; i < lista.length; i++) {\n    total += lista[i];\n  }\n  return total / lista.length;\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      'Acumulador em zero.',
      'Percorre somando tudo.',
      'Soma o item da vez.',
      'Fecha o laço.',
      'Divide o total pela quantidade de itens. A divisão fica fora do laço: dentro dele, a conta sairia errada.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-13',
    nivel: 'medio',
    titulo: 'Número primo',
    enunciado: 'Descubra se um número é primo. Primo é o número que só pode ser dividido por 1 e por ele mesmo. O 1 não é primo.',
    parametros: 'Crie a função `ehPrimo`, que recebe `n` e devolve `true` se ele for primo, ou `false` se não for.',
    assinatura: 'ehPrimo',
    modelo: 'function ehPrimo(n) {\n  \n}',
    testes: [
      { entrada: [2], esperado: true },
      { entrada: [7], esperado: true },
      { entrada: [9], esperado: false },
      { entrada: [1], esperado: false },
      { entrada: [4], esperado: false }
    ],
    dica: 'Trate o caso do 1 separado, porque ele é a exceção da regra. Depois teste dividir o número por todos os valores de 2 até ele menos 1: se algum der resto zero, ele não é primo e você já pode sair com `return false`.',
    solucao: 'function ehPrimo(n) {\n  if (n < 2) {\n    return false;\n  }\n  for (let i = 2; i < n; i++) {\n    if (n % i === 0) {\n      return false;\n    }\n  }\n  return true;\n}',
    explicacao: [
      'Declara a função recebendo `n`.',
      'O 1 (e qualquer coisa abaixo dele) é a exceção: não é primo.',
      'Sai devolvendo `false`.',
      'Fecha o `if`.',
      'Testa os divisores de 2 até `n - 1`.',
      'Se algum divide sem deixar resto...',
      '...o número tem outro divisor, então não é primo. Sai imediatamente, sem testar o resto.',
      'Fecha o `if` de dentro.',
      'Fecha o laço.',
      'Se o laço terminou sem achar divisor nenhum, o número é primo.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-14',
    nivel: 'medio',
    titulo: 'Quantas palavras',
    enunciado: 'Conte quantas palavras existem em uma frase. As palavras vêm separadas por um espaço.',
    parametros: 'Crie a função `contarQuantasPalavras`, que recebe `frase` e devolve a quantidade de palavras.',
    assinatura: 'contarQuantasPalavras',
    modelo: 'function contarQuantasPalavras(frase) {\n  \n}',
    testes: [
      { entrada: ['o rato roeu'], esperado: 3 },
      { entrada: ['oi'], esperado: 1 },
      { entrada: ['um dois tres quatro'], esperado: 4 }
    ],
    dica: '`split(" ")` corta a frase nos espaços e devolve uma lista de palavras. Depois é só perguntar o tamanho dessa lista.',
    solucao: 'function contarQuantasPalavras(frase) {\n  return frase.split(" ").length;\n}',
    explicacao: [
      'Declara a função recebendo a frase.',
      'Corta nos espaços e devolve o tamanho da lista resultante. Uma frase sem espaço nenhum vira uma lista de 1 item, o que dá a resposta certa.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-15',
    nivel: 'medio',
    titulo: 'Primeira letra maiúscula',
    enunciado: 'Deixe a primeira letra de um texto em maiúscula, mantendo o resto como está.',
    parametros: 'Crie a função `capitalizar`, que recebe `texto` e devolve ele com a primeira letra maiúscula. Texto vazio devolve texto vazio.',
    assinatura: 'capitalizar',
    modelo: 'function capitalizar(texto) {\n  \n}',
    testes: [
      { entrada: ['casa'], esperado: 'Casa' },
      { entrada: ['javascript'], esperado: 'Javascript' },
      { entrada: [''], esperado: '' },
      { entrada: ['a'], esperado: 'A' }
    ],
    dica: 'Junte duas partes: a primeira letra em maiúscula e o resto do texto a partir da posição 1, que você pega com `slice(1)`. Cuidado com o texto vazio: tentar pegar a letra da posição 0 nele causa erro, então trate esse caso antes.',
    solucao: 'function capitalizar(texto) {\n  if (texto === "") {\n    return "";\n  }\n  return texto[0].toUpperCase() + texto.slice(1);\n}',
    explicacao: [
      'Declara a função recebendo `texto`.',
      'Verifica o texto vazio antes de qualquer coisa.',
      'Devolve vazio e encerra — sem isso, a linha seguinte tentaria chamar `toUpperCase()` em algo que não existe e quebraria.',
      'Fecha o `if`.',
      'Pega a letra da posição 0 em maiúscula e cola o resto do texto a partir da posição 1.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-16',
    nivel: 'medio',
    titulo: 'Inverter a ordem das palavras',
    enunciado: 'Inverta a ordem das palavras de uma frase, mantendo cada palavra escrita normalmente.',
    parametros: 'Crie a função `inverterPalavras`, que recebe `frase` e devolve as palavras na ordem contrária, separadas por espaço.',
    assinatura: 'inverterPalavras',
    modelo: 'function inverterPalavras(frase) {\n  \n}',
    testes: [
      { entrada: ['o rato roeu'], esperado: 'roeu rato o' },
      { entrada: ['oi mundo'], esperado: 'mundo oi' },
      { entrada: ['sozinha'], esperado: 'sozinha' },
      { entrada: ['a b c d'], esperado: 'd c b a' }
    ],
    dica: 'São três passos encadeados: quebrar a frase em palavras com `split(" ")`, inverter a lista com `reverse()` e juntar de volta com `join(" ")`. Repare no espaço dentro do `join`: sem ele, as palavras saem grudadas.',
    solucao: 'function inverterPalavras(frase) {\n  return frase.split(" ").reverse().join(" ");\n}',
    explicacao: [
      'Declara a função recebendo a frase.',
      'Corta nos espaços, inverte a ordem dos itens e junta de volta usando espaço como cola. É o mesmo padrão de inverter um texto, mas cortando em palavras em vez de letras.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-17',
    nivel: 'medio',
    titulo: 'Repetir um texto',
    enunciado: 'Repita um texto uma quantidade de vezes, tudo colado.',
    parametros: 'Crie a função `repetir`, que recebe `texto` e `vezes`, e devolve o texto repetido essa quantidade de vezes. Zero vezes devolve texto vazio.',
    assinatura: 'repetir',
    modelo: 'function repetir(texto, vezes) {\n  \n}',
    testes: [
      { entrada: ['ab', 3], esperado: 'ababab' },
      { entrada: ['x', 1], esperado: 'x' },
      { entrada: ['oi', 0], esperado: '' },
      { entrada: ['-', 5], esperado: '-----' }
    ],
    dica: 'Comece com um texto vazio e vá concatenando dentro de um laço que roda a quantidade de vezes pedida. Também existe o método pronto `repeat()`, que resolve em uma linha.',
    solucao: 'function repetir(texto, vezes) {\n  let resultado = "";\n  for (let i = 0; i < vezes; i++) {\n    resultado += texto;\n  }\n  return resultado;\n}',
    explicacao: [
      'Declara a função recebendo o texto e a quantidade.',
      'Começa com texto vazio — que já é a resposta certa quando `vezes` é 0.',
      'Repete a quantidade de vezes pedida.',
      'Cola mais uma cópia do texto no resultado.',
      'Fecha o laço.',
      'Devolve o texto montado.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-18',
    nivel: 'medio',
    titulo: 'Quantos dígitos tem o número',
    enunciado: 'Descubra quantos dígitos um número inteiro positivo tem. Por exemplo, 123 tem 3 dígitos.',
    parametros: 'Crie a função `contarDigitos`, que recebe `numero` e devolve a quantidade de dígitos dele.',
    assinatura: 'contarDigitos',
    modelo: 'function contarDigitos(numero) {\n  \n}',
    testes: [
      { entrada: [123], esperado: 3 },
      { entrada: [5], esperado: 1 },
      { entrada: [1000], esperado: 4 },
      { entrada: [0], esperado: 1 }
    ],
    dica: 'O caminho mais direto é transformar o número em texto com `String(numero)` e perguntar o `length` dele. Números não têm `length`, mas textos têm.',
    solucao: 'function contarDigitos(numero) {\n  return String(numero).length;\n}',
    explicacao: [
      'Declara a função recebendo o número.',
      '`String(numero)` converte o número em texto, e aí o `length` passa a funcionar. Tentar `numero.length` direto devolveria `undefined`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-19',
    nivel: 'medio',
    titulo: 'Somar os dígitos',
    enunciado: 'Some todos os dígitos de um número. Por exemplo, 123 vira 1 + 2 + 3 = 6.',
    parametros: 'Crie a função `somarDigitos`, que recebe `numero` e devolve a soma dos dígitos dele.',
    assinatura: 'somarDigitos',
    modelo: 'function somarDigitos(numero) {\n  \n}',
    testes: [
      { entrada: [123], esperado: 6 },
      { entrada: [999], esperado: 27 },
      { entrada: [5], esperado: 5 },
      { entrada: [100], esperado: 1 }
    ],
    dica: 'Converta o número em texto e percorra os caracteres. Cada caractere é um texto, não um número — para somar de verdade você precisa convertê-lo com `Number()`, senão o `+` vai juntar textos em vez de somar.',
    solucao: 'function somarDigitos(numero) {\n  const texto = String(numero);\n  let total = 0;\n  for (let i = 0; i < texto.length; i++) {\n    total += Number(texto[i]);\n  }\n  return total;\n}',
    explicacao: [
      'Declara a função recebendo o número.',
      'Converte para texto, para poder percorrer dígito por dígito.',
      'Acumulador em zero.',
      'Percorre cada caractere.',
      '`Number()` transforma o caractere em número antes de somar. Sem ele, "1" + "2" viraria "12" em vez de 3.',
      'Fecha o laço.',
      'Devolve a soma.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-20',
    nivel: 'medio',
    titulo: 'Multiplicar todos os itens',
    enunciado: 'Multiplique todos os números de uma lista entre si.',
    parametros: 'Crie a função `multiplicarLista`, que recebe `lista` e devolve o resultado de multiplicar todos os itens. Lista vazia devolve 1.',
    assinatura: 'multiplicarLista',
    modelo: 'function multiplicarLista(lista) {\n  \n}',
    testes: [
      { entrada: [[2, 3, 4]], esperado: 24 },
      { entrada: [[5]], esperado: 5 },
      { entrada: [[]], esperado: 1 },
      { entrada: [[2, 0, 9]], esperado: 0 }
    ],
    dica: 'Aqui o acumulador começa em 1, não em zero. Se começasse em zero, qualquer multiplicação daria zero e o resultado seria sempre errado.',
    solucao: 'function multiplicarLista(lista) {\n  let total = 1;\n  for (let i = 0; i < lista.length; i++) {\n    total *= lista[i];\n  }\n  return total;\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      'Começa em 1, o elemento neutro da multiplicação. É também a resposta pedida para lista vazia.',
      'Percorre a lista.',
      '`total *= lista[i]` é o mesmo que `total = total * lista[i]`.',
      'Fecha o laço.',
      'Devolve o produto.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-21',
    nivel: 'medio',
    titulo: 'A lista contém o valor',
    enunciado: 'Descubra se um valor existe dentro de uma lista.',
    parametros: 'Crie a função `contem`, que recebe `lista` e `valor`, e devolve `true` se o valor estiver na lista, ou `false` se não estiver.',
    assinatura: 'contem',
    modelo: 'function contem(lista, valor) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 3], 2], esperado: true },
      { entrada: [[1, 2, 3], 9], esperado: false },
      { entrada: [[], 1], esperado: false },
      { entrada: [['a', 'b'], 'b'], esperado: true }
    ],
    dica: 'Listas têm o método `includes()`, que já devolve `true` ou `false`. Você também pode fazer na mão, percorrendo com um laço e saindo com `return true` assim que encontrar.',
    solucao: 'function contem(lista, valor) {\n  return lista.includes(valor);\n}',
    explicacao: [
      'Declara a função recebendo a lista e o valor procurado.',
      '`includes` percorre a lista por dentro e já devolve `true` ou `false`, então dá para devolver direto.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-22',
    nivel: 'medio',
    titulo: 'Posição de um item',
    enunciado: 'Descubra em qual posição um valor está dentro de uma lista. Se não estiver, devolva -1.',
    parametros: 'Crie a função `posicaoDe`, que recebe `lista` e `valor`, e devolve a posição da primeira aparição do valor, ou -1 se ele não existir na lista.',
    assinatura: 'posicaoDe',
    modelo: 'function posicaoDe(lista, valor) {\n  \n}',
    testes: [
      { entrada: [[10, 20, 30], 20], esperado: 1 },
      { entrada: [[10, 20, 30], 10], esperado: 0 },
      { entrada: [[10, 20, 30], 99], esperado: -1 },
      { entrada: [[], 1], esperado: -1 }
    ],
    dica: '`indexOf()` faz exatamente isso: devolve a posição do item ou -1 quando não encontra. Lembre que a contagem de posições começa em 0.',
    solucao: 'function posicaoDe(lista, valor) {\n  return lista.indexOf(valor);\n}',
    explicacao: [
      'Declara a função recebendo a lista e o valor.',
      '`indexOf` já segue exatamente a regra pedida, inclusive devolvendo -1 quando não encontra nada.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-23',
    nivel: 'medio',
    titulo: 'Sequência de Fibonacci',
    enunciado: 'Monte os primeiros termos da sequência de Fibonacci. Ela começa com 0 e 1, e cada termo seguinte é a soma dos dois anteriores: 0, 1, 1, 2, 3, 5, 8...',
    parametros: 'Crie a função `fibonacci`, que recebe `n` e devolve uma lista com os `n` primeiros termos da sequência. Se `n` for 0, devolve lista vazia.',
    assinatura: 'fibonacci',
    modelo: 'function fibonacci(n) {\n  \n}',
    testes: [
      { entrada: [5], esperado: [0, 1, 1, 2, 3] },
      { entrada: [1], esperado: [0] },
      { entrada: [2], esperado: [0, 1] },
      { entrada: [0], esperado: [] },
      { entrada: [8], esperado: [0, 1, 1, 2, 3, 5, 8, 13] }
    ],
    dica: 'Os dois primeiros termos são fixos e não seguem a regra da soma. Do terceiro em diante, cada termo é a soma dos dois que já estão na lista: `lista[i - 1] + lista[i - 2]`.',
    solucao: 'function fibonacci(n) {\n  const lista = [];\n  for (let i = 0; i < n; i++) {\n    if (i < 2) {\n      lista.push(i);\n    } else {\n      lista.push(lista[i - 1] + lista[i - 2]);\n    }\n  }\n  return lista;\n}',
    explicacao: [
      'Declara a função recebendo a quantidade de termos.',
      'Cria a lista vazia.',
      'Repete `n` vezes. Com `n` igual a 0, o laço não roda e a lista sai vazia.',
      'Os dois primeiros termos são especiais.',
      'Para as posições 0 e 1, o termo é o próprio índice: 0 e depois 1.',
      'A partir da terceira posição vale a regra da soma.',
      'Soma os dois termos anteriores, que já estão guardados na lista.',
      'Fecha o `else`.',
      'Fecha o laço.',
      'Devolve a sequência.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-24',
    nivel: 'medio',
    titulo: 'Contar quantas vezes um item aparece',
    enunciado: 'Conte quantas vezes um valor aparece dentro de uma lista.',
    parametros: 'Crie a função `contarOcorrencias`, que recebe `lista` e `valor`, e devolve quantas vezes esse valor aparece.',
    assinatura: 'contarOcorrencias',
    modelo: 'function contarOcorrencias(lista, valor) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 2, 3], 2], esperado: 2 },
      { entrada: [[1, 1, 1], 1], esperado: 3 },
      { entrada: [[1, 2, 3], 9], esperado: 0 },
      { entrada: [[], 1], esperado: 0 }
    ],
    dica: 'Percorra a lista inteira comparando cada item com o valor procurado. Diferente de `includes`, aqui você não pode sair no primeiro acerto: precisa continuar até o fim para contar todas as aparições.',
    solucao: 'function contarOcorrencias(lista, valor) {\n  let total = 0;\n  for (let i = 0; i < lista.length; i++) {\n    if (lista[i] === valor) {\n      total++;\n    }\n  }\n  return total;\n}',
    explicacao: [
      'Declara a função recebendo a lista e o valor.',
      'Contador em zero.',
      'Percorre a lista até o fim, sem parar no primeiro acerto.',
      'Compara o item da vez com o valor procurado.',
      'Achou: soma 1.',
      'Fecha o `if`.',
      'Fecha o laço.',
      'Devolve o total de aparições.',
      'Fecha a função.'
    ]
  },
  {
    id: 'medio-25',
    nivel: 'medio',
    titulo: 'Todos são positivos',
    enunciado: 'Descubra se todos os números de uma lista são positivos. Zero não é positivo.',
    parametros: 'Crie a função `todosPositivos`, que recebe `lista` e devolve `true` se todos os itens forem maiores que zero. Lista vazia devolve `true`.',
    assinatura: 'todosPositivos',
    modelo: 'function todosPositivos(lista) {\n  \n}',
    testes: [
      { entrada: [[1, 2, 3]], esperado: true },
      { entrada: [[1, -2, 3]], esperado: false },
      { entrada: [[]], esperado: true },
      { entrada: [[0, 1]], esperado: false }
    ],
    dica: 'Percorra a lista e saia com `return false` assim que encontrar um item que não seja positivo. Se o laço terminar inteiro sem encontrar nenhum, aí sim devolva `true` — e é isso que faz a lista vazia dar `true` naturalmente.',
    solucao: 'function todosPositivos(lista) {\n  for (let i = 0; i < lista.length; i++) {\n    if (lista[i] <= 0) {\n      return false;\n    }\n  }\n  return true;\n}',
    explicacao: [
      'Declara a função recebendo a lista.',
      'Percorre todos os itens.',
      'Testa se o item da vez não é positivo. O `<=` inclui o zero, que o enunciado não considera positivo.',
      'Um único item já derruba a resposta inteira: sai imediatamente com `false`.',
      'Fecha o `if`.',
      'Fecha o laço.',
      'Chegou até aqui sem sair: nenhum item falhou, então todos são positivos. Em lista vazia o laço nem roda e a resposta é `true`.',
      'Fecha a função.'
    ]
  }
];

module.exports = QUESTOES_MEDIO;
