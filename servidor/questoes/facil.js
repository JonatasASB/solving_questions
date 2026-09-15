/* Nível fácil — 3 pontos cada.
   Operação única e direta: uma conta, uma comparação, um método de texto. */

const QUESTOES_FACIL = [
  {
    id: 'facil-01',
    nivel: 'facil',
    titulo: 'Somar dois números',
    enunciado: 'Some dois números e devolva o resultado.',
    parametros: 'Crie a função `somar`, que recebe `a` como primeiro número e `b` como segundo número, e devolve a soma dos dois.',
    assinatura: 'somar',
    modelo: 'function somar(a, b) {\n  \n}',
    testes: [
      { entrada: [2, 3], esperado: 5 },
      { entrada: [10, -4], esperado: 6 },
      { entrada: [0, 0], esperado: 0 },
      { entrada: [-5, -5], esperado: -10 }
    ],
    dica: 'O operador `+` soma dois números. Só calcular não basta: use `return` para devolver o resultado para fora da função.',
    solucao: 'function somar(a, b) {\n  return a + b;\n}',
    explicacao: [
      'Declara a função `somar` recebendo dois valores, que dentro dela se chamam `a` e `b`.',
      'Soma os dois e devolve o resultado com `return`. Sem o `return`, a função calcula mas não entrega nada.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-02',
    nivel: 'facil',
    titulo: 'Média de três notas',
    enunciado: 'Calcule a média de três notas.',
    parametros: 'Considere `n1` como primeira nota, `n2` como segunda nota, `n3` como terceira nota e `media` como a média. Crie a função `media`, que recebe as três notas e devolve a média delas.',
    assinatura: 'media',
    modelo: 'function media(n1, n2, n3) {\n  \n}',
    testes: [
      { entrada: [10, 10, 10], esperado: 10 },
      { entrada: [7, 8, 9], esperado: 8 },
      { entrada: [0, 0, 0], esperado: 0 },
      { entrada: [5, 10, 6], esperado: 7 }
    ],
    dica: 'Some as três notas primeiro e só depois divida por 3. Se dividir antes de somar tudo, a conta sai errada — o parêntese resolve isso.',
    solucao: 'function media(n1, n2, n3) {\n  return (n1 + n2 + n3) / 3;\n}',
    explicacao: [
      'Declara a função `media` recebendo as três notas.',
      'Os parênteses garantem que a soma aconteça antes da divisão; depois divide por 3 e devolve.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-03',
    nivel: 'facil',
    titulo: 'Par ou ímpar',
    enunciado: 'Descubra se um número é par ou ímpar.',
    parametros: 'Crie a função `parOuImpar`, que recebe `numero` e devolve o texto `"par"` ou o texto `"impar"` (sem acento).',
    assinatura: 'parOuImpar',
    modelo: 'function parOuImpar(numero) {\n  \n}',
    testes: [
      { entrada: [4], esperado: 'par' },
      { entrada: [7], esperado: 'impar' },
      { entrada: [0], esperado: 'par' },
      { entrada: [-3], esperado: 'impar' }
    ],
    dica: 'O operador `%` devolve o resto de uma divisão. Um número é par quando o resto da divisão por 2 é zero.',
    solucao: 'function parOuImpar(numero) {\n  if (numero % 2 === 0) {\n    return "par";\n  }\n  return "impar";\n}',
    explicacao: [
      'Declara a função recebendo `numero`.',
      'Pergunta se o resto da divisão por 2 é exatamente zero.',
      'Se for, devolve "par" e a função termina aqui.',
      'Fecha o `if`.',
      'Só chega nesta linha quando o `if` foi falso — então o número é ímpar.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-04',
    nivel: 'facil',
    titulo: 'O maior de dois números',
    enunciado: 'Descubra qual é o maior entre dois números.',
    parametros: 'Crie a função `maior`, que recebe `a` e `b` e devolve o maior dos dois. Se forem iguais, devolva esse mesmo valor.',
    assinatura: 'maior',
    modelo: 'function maior(a, b) {\n  \n}',
    testes: [
      { entrada: [3, 9], esperado: 9 },
      { entrada: [10, 2], esperado: 10 },
      { entrada: [5, 5], esperado: 5 },
      { entrada: [-1, -7], esperado: -1 }
    ],
    dica: 'Compare os dois com `>` dentro de um `if`. Repare que, quando são iguais, devolver qualquer um dos dois já dá o resultado certo.',
    solucao: 'function maior(a, b) {\n  if (a > b) {\n    return a;\n  }\n  return b;\n}',
    explicacao: [
      'Declara a função recebendo os dois números.',
      'Pergunta se `a` é maior que `b`.',
      'Se for, devolve `a`.',
      'Fecha o `if`.',
      'Chega aqui quando `a` não é maior — ou seja, `b` é maior ou os dois são iguais. Nos dois casos devolver `b` está certo.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-05',
    nivel: 'facil',
    titulo: 'Celsius para Fahrenheit',
    enunciado: 'Converta uma temperatura de Celsius para Fahrenheit. A fórmula é: multiplicar por 9, dividir por 5 e somar 32.',
    parametros: 'Crie a função `celsiusParaFahrenheit`, que recebe `celsius` e devolve a temperatura correspondente em Fahrenheit.',
    assinatura: 'celsiusParaFahrenheit',
    modelo: 'function celsiusParaFahrenheit(celsius) {\n  \n}',
    testes: [
      { entrada: [0], esperado: 32 },
      { entrada: [100], esperado: 212 },
      { entrada: [37], esperado: 98.6 },
      { entrada: [-40], esperado: -40 }
    ],
    dica: 'Siga a ordem da fórmula: primeiro a multiplicação e a divisão, e só no fim a soma. Em JavaScript, `*` e `/` já acontecem antes do `+` naturalmente.',
    solucao: 'function celsiusParaFahrenheit(celsius) {\n  return celsius * 9 / 5 + 32;\n}',
    explicacao: [
      'Declara a função recebendo a temperatura em Celsius.',
      'Multiplica por 9, divide por 5 e soma 32. JavaScript resolve `*` e `/` antes do `+`, então não precisa de parênteses aqui.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-06',
    nivel: 'facil',
    titulo: 'Dobro de um número',
    enunciado: 'Devolva o dobro de um número.',
    parametros: 'Crie a função `dobro`, que recebe `numero` e devolve ele multiplicado por 2.',
    assinatura: 'dobro',
    modelo: 'function dobro(numero) {\n  \n}',
    testes: [
      { entrada: [5], esperado: 10 },
      { entrada: [0], esperado: 0 },
      { entrada: [-3], esperado: -6 },
      { entrada: [2.5], esperado: 5 }
    ],
    dica: 'Dobrar é multiplicar por 2. O operador de multiplicação em JavaScript é `*`.',
    solucao: 'function dobro(numero) {\n  return numero * 2;\n}',
    explicacao: [
      'Declara a função recebendo `numero`.',
      'Multiplica por 2 e devolve.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-07',
    nivel: 'facil',
    titulo: 'Área do retângulo',
    enunciado: 'Calcule a área de um retângulo. A área é a base multiplicada pela altura.',
    parametros: 'Crie a função `areaRetangulo`, que recebe `base` e `altura` e devolve a área.',
    assinatura: 'areaRetangulo',
    modelo: 'function areaRetangulo(base, altura) {\n  \n}',
    testes: [
      { entrada: [4, 5], esperado: 20 },
      { entrada: [10, 2], esperado: 20 },
      { entrada: [1, 1], esperado: 1 },
      { entrada: [7, 0], esperado: 0 }
    ],
    dica: 'A área é uma multiplicação simples entre os dois valores recebidos.',
    solucao: 'function areaRetangulo(base, altura) {\n  return base * altura;\n}',
    explicacao: [
      'Declara a função recebendo as duas medidas.',
      'Multiplica base por altura e devolve.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-08',
    nivel: 'facil',
    titulo: 'Minutos para segundos',
    enunciado: 'Converta uma quantidade de minutos em segundos. Cada minuto tem 60 segundos.',
    parametros: 'Crie a função `paraSegundos`, que recebe `minutos` e devolve o total de segundos.',
    assinatura: 'paraSegundos',
    modelo: 'function paraSegundos(minutos) {\n  \n}',
    testes: [
      { entrada: [1], esperado: 60 },
      { entrada: [5], esperado: 300 },
      { entrada: [0], esperado: 0 },
      { entrada: [2.5], esperado: 150 }
    ],
    dica: 'Se 1 minuto tem 60 segundos, então N minutos têm N vezes 60 segundos.',
    solucao: 'function paraSegundos(minutos) {\n  return minutos * 60;\n}',
    explicacao: [
      'Declara a função recebendo os minutos.',
      'Multiplica por 60 e devolve o total em segundos.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-09',
    nivel: 'facil',
    titulo: 'Maior de idade',
    enunciado: 'Descubra se uma pessoa é maior de idade. É maior de idade quem tem 18 anos ou mais.',
    parametros: 'Crie a função `ehMaiorDeIdade`, que recebe `idade` e devolve `true` ou `false`.',
    assinatura: 'ehMaiorDeIdade',
    modelo: 'function ehMaiorDeIdade(idade) {\n  \n}',
    testes: [
      { entrada: [18], esperado: true },
      { entrada: [17], esperado: false },
      { entrada: [40], esperado: true },
      { entrada: [0], esperado: false }
    ],
    dica: 'O operador `>=` significa "maior ou igual". Como ele já devolve `true` ou `false`, dá para devolver a comparação direto, sem `if`.',
    solucao: 'function ehMaiorDeIdade(idade) {\n  return idade >= 18;\n}',
    explicacao: [
      'Declara a função recebendo a idade.',
      'A comparação `>=` já vale `true` ou `false`, então devolve ela diretamente. Repare no `=`: com apenas `>`, quem tem exatamente 18 ficaria de fora.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-10',
    nivel: 'facil',
    titulo: 'Metade de um número',
    enunciado: 'Devolva a metade de um número.',
    parametros: 'Crie a função `metade`, que recebe `numero` e devolve ele dividido por 2.',
    assinatura: 'metade',
    modelo: 'function metade(numero) {\n  \n}',
    testes: [
      { entrada: [10], esperado: 5 },
      { entrada: [7], esperado: 3.5 },
      { entrada: [0], esperado: 0 },
      { entrada: [-8], esperado: -4 }
    ],
    dica: 'O operador de divisão em JavaScript é `/`. Repare que a metade de 7 não é um número inteiro, e tudo bem: JavaScript devolve 3.5 naturalmente.',
    solucao: 'function metade(numero) {\n  return numero / 2;\n}',
    explicacao: [
      'Declara a função recebendo `numero`.',
      'Divide por 2 e devolve.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-11',
    nivel: 'facil',
    titulo: 'Perímetro do quadrado',
    enunciado: 'Calcule o perímetro de um quadrado. O perímetro é a soma dos quatro lados, e num quadrado todos os lados são iguais.',
    parametros: 'Crie a função `perimetroQuadrado`, que recebe `lado` e devolve o perímetro.',
    assinatura: 'perimetroQuadrado',
    modelo: 'function perimetroQuadrado(lado) {\n  \n}',
    testes: [
      { entrada: [5], esperado: 20 },
      { entrada: [1], esperado: 4 },
      { entrada: [0], esperado: 0 },
      { entrada: [2.5], esperado: 10 }
    ],
    dica: 'Somar o mesmo valor quatro vezes é o mesmo que multiplicá-lo por 4.',
    solucao: 'function perimetroQuadrado(lado) {\n  return lado * 4;\n}',
    explicacao: [
      'Declara a função recebendo a medida do lado.',
      'Como os quatro lados são iguais, multiplicar por 4 dá o perímetro.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-12',
    nivel: 'facil',
    titulo: 'Preço com desconto',
    enunciado: 'Aplique 10% de desconto em um preço e devolva quanto o cliente vai pagar.',
    parametros: 'Crie a função `comDesconto`, que recebe `preco` e devolve o valor já com 10% de desconto.',
    assinatura: 'comDesconto',
    modelo: 'function comDesconto(preco) {\n  \n}',
    testes: [
      { entrada: [100], esperado: 90 },
      { entrada: [50], esperado: 45 },
      { entrada: [0], esperado: 0 },
      { entrada: [200], esperado: 180 }
    ],
    dica: 'Tirar 10% é o mesmo que ficar com 90% do valor. E 90% de um número é ele multiplicado por 0.9.',
    solucao: 'function comDesconto(preco) {\n  return preco * 0.9;\n}',
    explicacao: [
      'Declara a função recebendo o preço.',
      'Multiplica por 0.9, que é o mesmo que manter 90% do valor — ou seja, tirar os 10%.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-13',
    nivel: 'facil',
    titulo: 'Positivo, negativo ou zero',
    enunciado: 'Diga se um número é positivo, negativo ou zero.',
    parametros: 'Crie a função `sinal`, que recebe `numero` e devolve o texto `"positivo"`, `"negativo"` ou `"zero"`.',
    assinatura: 'sinal',
    modelo: 'function sinal(numero) {\n  \n}',
    testes: [
      { entrada: [5], esperado: 'positivo' },
      { entrada: [-2], esperado: 'negativo' },
      { entrada: [0], esperado: 'zero' },
      { entrada: [0.5], esperado: 'positivo' }
    ],
    dica: 'São três situações, então você precisa de mais de uma comparação. Teste primeiro se é maior que zero, depois se é menor que zero; se não for nenhum dos dois, só sobra o zero.',
    solucao: 'function sinal(numero) {\n  if (numero > 0) {\n    return "positivo";\n  }\n  if (numero < 0) {\n    return "negativo";\n  }\n  return "zero";\n}',
    explicacao: [
      'Declara a função recebendo `numero`.',
      'Primeira pergunta: é maior que zero?',
      'Se for, devolve "positivo" e a função acaba aqui.',
      'Fecha o primeiro `if`.',
      'Segunda pergunta: é menor que zero?',
      'Se for, devolve "negativo".',
      'Fecha o segundo `if`.',
      'Se nenhum dos dois `if` foi verdadeiro, só resta uma possibilidade: o número é zero.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-14',
    nivel: 'facil',
    titulo: 'Tamanho do texto',
    enunciado: 'Descubra quantos caracteres tem um texto. Espaços contam.',
    parametros: 'Crie a função `tamanhoDoTexto`, que recebe `texto` e devolve a quantidade de caracteres.',
    assinatura: 'tamanhoDoTexto',
    modelo: 'function tamanhoDoTexto(texto) {\n  \n}',
    testes: [
      { entrada: ['casa'], esperado: 4 },
      { entrada: [''], esperado: 0 },
      { entrada: ['oi mundo'], esperado: 8 },
      { entrada: ['a'], esperado: 1 }
    ],
    dica: 'Todo texto em JavaScript tem uma propriedade `length`, que guarda quantos caracteres ele tem. Repare que é propriedade, não função: escreve-se sem parênteses.',
    solucao: 'function tamanhoDoTexto(texto) {\n  return texto.length;\n}',
    explicacao: [
      'Declara a função recebendo `texto`.',
      'Devolve `texto.length`. Sem parênteses, porque `length` é uma propriedade e não um método.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-15',
    nivel: 'facil',
    titulo: 'Nome completo',
    enunciado: 'Junte um nome e um sobrenome, separados por um espaço.',
    parametros: 'Crie a função `nomeCompleto`, que recebe `nome` e `sobrenome` e devolve os dois juntos com um espaço entre eles.',
    assinatura: 'nomeCompleto',
    modelo: 'function nomeCompleto(nome, sobrenome) {\n  \n}',
    testes: [
      { entrada: ['Ana', 'Souza'], esperado: 'Ana Souza' },
      { entrada: ['João', 'Silva'], esperado: 'João Silva' },
      { entrada: ['A', 'B'], esperado: 'A B' }
    ],
    dica: 'O operador `+` também junta textos. O espaço no meio precisa ser escrito por você, como um texto de um caractere: `" "`.',
    solucao: 'function nomeCompleto(nome, sobrenome) {\n  return nome + " " + sobrenome;\n}',
    explicacao: [
      'Declara a função recebendo as duas partes do nome.',
      'Junta nome, espaço e sobrenome. Sem o `" "` no meio, sairia tudo grudado.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-16',
    nivel: 'facil',
    titulo: 'Texto em maiúsculas',
    enunciado: 'Transforme um texto inteiro em letras maiúsculas.',
    parametros: 'Crie a função `paraMaiusculas`, que recebe `texto` e devolve ele todo em maiúsculas.',
    assinatura: 'paraMaiusculas',
    modelo: 'function paraMaiusculas(texto) {\n  \n}',
    testes: [
      { entrada: ['casa'], esperado: 'CASA' },
      { entrada: ['JavaScript'], esperado: 'JAVASCRIPT' },
      { entrada: [''], esperado: '' },
      { entrada: ['Já É'], esperado: 'JÁ É' }
    ],
    dica: 'Textos em JavaScript têm o método `toUpperCase()`, que devolve uma versão em maiúsculas. Ele não altera o texto original, devolve um novo.',
    solucao: 'function paraMaiusculas(texto) {\n  return texto.toUpperCase();\n}',
    explicacao: [
      'Declara a função recebendo `texto`.',
      'Chama `toUpperCase()` e devolve o resultado. Os parênteses são obrigatórios: é um método, não uma propriedade.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-17',
    nivel: 'facil',
    titulo: 'Dias para horas',
    enunciado: 'Converta uma quantidade de dias em horas. Cada dia tem 24 horas.',
    parametros: 'Crie a função `diasParaHoras`, que recebe `dias` e devolve o total de horas.',
    assinatura: 'diasParaHoras',
    modelo: 'function diasParaHoras(dias) {\n  \n}',
    testes: [
      { entrada: [1], esperado: 24 },
      { entrada: [7], esperado: 168 },
      { entrada: [0], esperado: 0 },
      { entrada: [0.5], esperado: 12 }
    ],
    dica: 'Cada dia vale 24 horas, então basta multiplicar a quantidade de dias por 24.',
    solucao: 'function diasParaHoras(dias) {\n  return dias * 24;\n}',
    explicacao: [
      'Declara a função recebendo os dias.',
      'Multiplica por 24 e devolve o total de horas.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-18',
    nivel: 'facil',
    titulo: 'Resto da divisão',
    enunciado: 'Descubra o resto da divisão de um número por outro. Por exemplo, 10 dividido por 3 dá 3 e sobra 1 — o resto é 1.',
    parametros: 'Crie a função `resto`, que recebe `a` e `b` e devolve o resto da divisão de `a` por `b`.',
    assinatura: 'resto',
    modelo: 'function resto(a, b) {\n  \n}',
    testes: [
      { entrada: [10, 3], esperado: 1 },
      { entrada: [9, 3], esperado: 0 },
      { entrada: [7, 2], esperado: 1 },
      { entrada: [5, 10], esperado: 5 }
    ],
    dica: 'JavaScript tem um operador só para isso: o `%`, chamado de módulo ou resto. Ele é diferente do `/`, que dá o resultado da divisão.',
    solucao: 'function resto(a, b) {\n  return a % b;\n}',
    explicacao: [
      'Declara a função recebendo os dois números.',
      'O `%` devolve o que sobra da divisão. Repare no último teste: 5 dividido por 10 não cabe nenhuma vez, então sobra o próprio 5.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-19',
    nivel: 'facil',
    titulo: 'Valores iguais',
    enunciado: 'Descubra se dois valores são exatamente iguais — mesmo conteúdo e mesmo tipo.',
    parametros: 'Crie a função `saoIguais`, que recebe `a` e `b` e devolve `true` se forem exatamente iguais, ou `false` se não forem.',
    assinatura: 'saoIguais',
    modelo: 'function saoIguais(a, b) {\n  \n}',
    testes: [
      { entrada: [2, 2], esperado: true },
      { entrada: [2, '2'], esperado: false },
      { entrada: ['a', 'a'], esperado: true },
      { entrada: [0, false], esperado: false }
    ],
    dica: 'Use `===`, com três sinais de igual. Ele compara valor e tipo. O `==`, com dois, é mais frouxo e diria que o número 2 e o texto "2" são iguais — que é justamente o que os testes não querem.',
    solucao: 'function saoIguais(a, b) {\n  return a === b;\n}',
    explicacao: [
      'Declara a função recebendo os dois valores.',
      'Compara com `===` e devolve o resultado. Os três sinais exigem que o tipo também seja igual, por isso o número 2 não é igual ao texto "2".',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-20',
    nivel: 'facil',
    titulo: 'Preço total da compra',
    enunciado: 'Calcule quanto custa comprar várias unidades de um produto.',
    parametros: 'Crie a função `precoTotal`, que recebe `quantidade` e `precoUnitario` e devolve o valor total da compra.',
    assinatura: 'precoTotal',
    modelo: 'function precoTotal(quantidade, precoUnitario) {\n  \n}',
    testes: [
      { entrada: [3, 10], esperado: 30 },
      { entrada: [1, 99], esperado: 99 },
      { entrada: [0, 50], esperado: 0 },
      { entrada: [4, 2.5], esperado: 10 }
    ],
    dica: 'O total é a quantidade multiplicada pelo preço de cada unidade.',
    solucao: 'function precoTotal(quantidade, precoUnitario) {\n  return quantidade * precoUnitario;\n}',
    explicacao: [
      'Declara a função recebendo a quantidade e o preço unitário.',
      'Multiplica os dois e devolve o total.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-21',
    nivel: 'facil',
    titulo: 'Reais para centavos',
    enunciado: 'Converta um valor em reais para centavos. Cada real tem 100 centavos.',
    parametros: 'Crie a função `paraCentavos`, que recebe `reais` e devolve o valor em centavos.',
    assinatura: 'paraCentavos',
    modelo: 'function paraCentavos(reais) {\n  \n}',
    testes: [
      { entrada: [10], esperado: 1000 },
      { entrada: [1.5], esperado: 150 },
      { entrada: [0], esperado: 0 },
      { entrada: [25.5], esperado: 2550 }
    ],
    dica: 'Se 1 real vale 100 centavos, multiplicar o valor por 100 dá o total de centavos.',
    solucao: 'function paraCentavos(reais) {\n  return reais * 100;\n}',
    explicacao: [
      'Declara a função recebendo o valor em reais.',
      'Multiplica por 100 e devolve o valor em centavos.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-22',
    nivel: 'facil',
    titulo: 'Primeira letra',
    enunciado: 'Devolva apenas a primeira letra de um texto.',
    parametros: 'Crie a função `primeiraLetra`, que recebe `texto` e devolve o primeiro caractere dele.',
    assinatura: 'primeiraLetra',
    modelo: 'function primeiraLetra(texto) {\n  \n}',
    testes: [
      { entrada: ['casa'], esperado: 'c' },
      { entrada: ['Java'], esperado: 'J' },
      { entrada: ['a'], esperado: 'a' },
      { entrada: ['oi mundo'], esperado: 'o' }
    ],
    dica: 'Dá para acessar um caractere pela posição, usando colchetes. Atenção: em JavaScript a contagem começa em 0, então a primeira letra fica na posição 0, não na 1.',
    solucao: 'function primeiraLetra(texto) {\n  return texto[0];\n}',
    explicacao: [
      'Declara a função recebendo `texto`.',
      'Pega o caractere da posição 0 — a primeira, já que a contagem começa do zero.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-23',
    nivel: 'facil',
    titulo: 'Última letra',
    enunciado: 'Devolva apenas a última letra de um texto.',
    parametros: 'Crie a função `ultimaLetra`, que recebe `texto` e devolve o último caractere dele.',
    assinatura: 'ultimaLetra',
    modelo: 'function ultimaLetra(texto) {\n  \n}',
    testes: [
      { entrada: ['sol'], esperado: 'l' },
      { entrada: ['JavaScript'], esperado: 't' },
      { entrada: ['a'], esperado: 'a' },
      { entrada: ['casa'], esperado: 'a' }
    ],
    dica: 'A última posição de um texto é sempre o tamanho dele menos 1. Um texto de 3 letras tem posições 0, 1 e 2 — a última é a 2.',
    solucao: 'function ultimaLetra(texto) {\n  return texto[texto.length - 1];\n}',
    explicacao: [
      'Declara a função recebendo `texto`.',
      'Usa `texto.length - 1` como posição. O `- 1` é necessário porque a contagem começa em 0: sem ele, você pediria uma posição que não existe.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-24',
    nivel: 'facil',
    titulo: 'Está entre dois valores',
    enunciado: 'Descubra se um número está dentro de um intervalo. Os limites contam como dentro.',
    parametros: 'Crie a função `estaEntre`, que recebe `numero`, `minimo` e `maximo`, e devolve `true` se o número estiver no intervalo (incluindo os limites), ou `false` se estiver fora.',
    assinatura: 'estaEntre',
    modelo: 'function estaEntre(numero, minimo, maximo) {\n  \n}',
    testes: [
      { entrada: [5, 1, 10], esperado: true },
      { entrada: [1, 1, 10], esperado: true },
      { entrada: [10, 1, 10], esperado: true },
      { entrada: [0, 1, 10], esperado: false },
      { entrada: [11, 1, 10], esperado: false }
    ],
    dica: 'São duas condições ao mesmo tempo: o número precisa ser maior ou igual ao mínimo E menor ou igual ao máximo. O operador `&&` junta as duas exigências.',
    solucao: 'function estaEntre(numero, minimo, maximo) {\n  return numero >= minimo && numero <= maximo;\n}',
    explicacao: [
      'Declara a função recebendo o número e os dois limites.',
      'O `&&` só devolve `true` quando as duas comparações são verdadeiras. Os sinais `>=` e `<=` incluem os próprios limites, como o enunciado pede.',
      'Fecha a função.'
    ]
  },
  {
    id: 'facil-25',
    nivel: 'facil',
    titulo: 'Calcular o IMC',
    enunciado: 'Calcule o IMC de uma pessoa. A fórmula é o peso dividido pela altura multiplicada por ela mesma.',
    parametros: 'Crie a função `imc`, que recebe `peso` (em quilos) e `altura` (em metros) e devolve o IMC.',
    assinatura: 'imc',
    modelo: 'function imc(peso, altura) {\n  \n}',
    testes: [
      { entrada: [80, 2], esperado: 20 },
      { entrada: [45, 1.5], esperado: 20 },
      { entrada: [98, 1.4], esperado: 50 },
      { entrada: [60, 2], esperado: 15 }
    ],
    dica: 'Calcule a altura vezes a altura primeiro, e só depois divida o peso por esse resultado. Os parênteses são essenciais: sem eles, JavaScript divide pelo primeiro valor e depois multiplica, dando outro número.',
    solucao: 'function imc(peso, altura) {\n  return peso / (altura * altura);\n}',
    explicacao: [
      'Declara a função recebendo peso e altura.',
      'Os parênteses fazem a multiplicação acontecer antes da divisão. Sem eles, `peso / altura * altura` daria simplesmente o peso de volta.',
      'Fecha a função.'
    ]
  }
];

module.exports = QUESTOES_FACIL;
