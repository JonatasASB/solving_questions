/* Nível Deus — 10 pontos cada.
   POO, assincronismo e consumo de API pública.

   As questões de API trazem `mockFetch`: o corretor troca o `fetch` por
   respostas fixas, então o exercício funciona offline e não quebra se a API
   sair do ar. O endereço real fica no enunciado para o usuário se basear. */

const QUESTOES_DEUS = [
  {
    id: 'deus-01',
    nivel: 'deus',
    titulo: 'Classe ContaBancaria',
    enunciado: 'Crie uma conta bancária usando classe, com depósito e saque. O saque não pode deixar a conta negativa.',
    parametros: 'Crie a classe `ContaBancaria`. O construtor recebe o saldo inicial e guarda em `this.saldo`. Ela tem o método `depositar(valor)`, que soma ao saldo, e o método `sacar(valor)`, que subtrai do saldo apenas se houver saldo suficiente. `sacar` devolve `true` quando conseguiu sacar e `false` quando não havia saldo — e, nesse caso, o saldo não muda.',
    assinatura: 'ContaBancaria',
    modelo: 'class ContaBancaria {\n  constructor(saldoInicial) {\n    \n  }\n\n  depositar(valor) {\n    \n  }\n\n  sacar(valor) {\n    \n  }\n}',
    testes: [
      { chamada: 'const c = new ContaBancaria(100); c.depositar(50); return c.saldo;', esperado: 150 },
      { chamada: 'const c = new ContaBancaria(100); return c.sacar(30);', esperado: true },
      { chamada: 'const c = new ContaBancaria(100); c.sacar(30); return c.saldo;', esperado: 70 },
      { chamada: 'const c = new ContaBancaria(100); c.sacar(500); return c.saldo;', esperado: 100 },
      { chamada: 'const c = new ContaBancaria(0); return c.sacar(1);', esperado: false }
    ],
    dica: 'Dentro da classe, `this.saldo` é a caixinha onde o valor fica guardado entre uma chamada e outra. No `sacar`, teste antes se o valor pedido cabe no saldo: se não couber, saia com `return false` sem mexer em nada.',
    solucao: 'class ContaBancaria {\n  constructor(saldoInicial) {\n    this.saldo = saldoInicial;\n  }\n\n  depositar(valor) {\n    this.saldo += valor;\n  }\n\n  sacar(valor) {\n    if (valor > this.saldo) {\n      return false;\n    }\n    this.saldo -= valor;\n    return true;\n  }\n}',
    explicacao: [
      'Declara a classe.',
      'O construtor roda quando alguém escreve `new ContaBancaria(...)`.',
      'Guarda o saldo inicial em `this.saldo`. É o `this` que faz o valor sobreviver depois que o construtor termina.',
      'Fecha o construtor.',
      '(linha em branco)',
      'Método de depósito.',
      'Soma o valor ao saldo guardado.',
      'Fecha o método.',
      '(linha em branco)',
      'Método de saque.',
      'Antes de qualquer coisa, verifica se o valor pedido é maior que o saldo.',
      'Se for, sai devolvendo `false` — e, por sair aqui, o saldo nunca chega a ser alterado.',
      'Fecha o `if`.',
      'Só chega aqui quando há saldo: subtrai o valor.',
      'Avisa que o saque deu certo.',
      'Fecha o método.',
      'Fecha a classe.'
    ]
  },
  {
    id: 'deus-02',
    nivel: 'deus',
    titulo: 'Classe Pilha',
    enunciado: 'Implemente uma pilha: uma estrutura onde o último item que entra é o primeiro que sai, como uma pilha de pratos.',
    parametros: 'Crie a classe `Pilha`. O construtor não recebe nada e começa com a pilha vazia. Ela tem: `empilhar(item)`, que coloca um item no topo; `desempilhar()`, que remove e devolve o item do topo; `topo()`, que devolve o item do topo sem remover; e `tamanho()`, que devolve quantos itens há. Desempilhar de uma pilha vazia devolve `undefined`.',
    assinatura: 'Pilha',
    modelo: 'class Pilha {\n  constructor() {\n    \n  }\n\n  empilhar(item) {\n    \n  }\n\n  desempilhar() {\n    \n  }\n\n  topo() {\n    \n  }\n\n  tamanho() {\n    \n  }\n}',
    testes: [
      { chamada: 'const p = new Pilha(); p.empilhar(1); p.empilhar(2); return p.topo();', esperado: 2 },
      { chamada: 'const p = new Pilha(); p.empilhar("a"); p.empilhar("b"); return p.desempilhar();', esperado: 'b' },
      { chamada: 'const p = new Pilha(); p.empilhar(1); p.empilhar(2); p.desempilhar(); return p.tamanho();', esperado: 1 },
      { chamada: 'const p = new Pilha(); return p.tamanho();', esperado: 0 },
      { chamada: 'const p = new Pilha(); return p.desempilhar();', esperado: undefined }
    ],
    dica: 'Guarde os itens em uma lista dentro de `this`. Os métodos `push` e `pop` de array já se comportam exatamente como empilhar e desempilhar — inclusive `pop` devolvendo `undefined` quando a lista está vazia, que é justo o que o último teste espera.',
    solucao: 'class Pilha {\n  constructor() {\n    this.itens = [];\n  }\n\n  empilhar(item) {\n    this.itens.push(item);\n  }\n\n  desempilhar() {\n    return this.itens.pop();\n  }\n\n  topo() {\n    return this.itens[this.itens.length - 1];\n  }\n\n  tamanho() {\n    return this.itens.length;\n  }\n}',
    explicacao: [
      'Declara a classe.',
      'Construtor, chamado no `new Pilha()`.',
      'Cria a lista vazia que vai guardar os itens.',
      'Fecha o construtor.',
      '(linha em branco)',
      'Método para empilhar.',
      '`push` adiciona no fim da lista — que é o topo da pilha.',
      'Fecha o método.',
      '(linha em branco)',
      'Método para desempilhar.',
      '`pop` remove o último item e devolve ele. Em lista vazia devolve `undefined` sozinho, sem precisar de `if`.',
      'Fecha o método.',
      '(linha em branco)',
      'Método para espiar o topo.',
      'Pega o último item pela posição, sem remover. A última posição é sempre o tamanho menos 1.',
      'Fecha o método.',
      '(linha em branco)',
      'Método de tamanho.',
      'Devolve quantos itens a lista tem.',
      'Fecha o método.',
      'Fecha a classe.'
    ]
  },
  {
    id: 'deus-03',
    nivel: 'deus',
    titulo: 'Buscar nome de usuário em API',
    enunciado: 'Busque os dados de um usuário em uma API pública e devolva o nome dele.\n\nAPI: https://jsonplaceholder.typicode.com/users/1 — devolve um objeto com os campos `id`, `name`, `email`, entre outros.',
    parametros: 'Crie a função assíncrona `buscarNomeDoUsuario`, que recebe `id` e devolve o valor do campo `name` do usuário. Monte a URL juntando `https://jsonplaceholder.typicode.com/users/` com o `id` recebido.',
    assinatura: 'buscarNomeDoUsuario',
    assincrona: true,
    modelo: 'async function buscarNomeDoUsuario(id) {\n  \n}',
    mockFetch: [
      { contem: '/users/1', resposta: { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' } },
      { contem: '/users/2', resposta: { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv' } },
      { contem: '/users/3', resposta: { id: 3, name: 'Clementine Bauch', email: 'Nathan@yesenia.net' } }
    ],
    testes: [
      { entrada: [1], esperado: 'Leanne Graham' },
      { entrada: [2], esperado: 'Ervin Howell' },
      { entrada: [3], esperado: 'Clementine Bauch' }
    ],
    dica: 'São dois `await`: o primeiro no `fetch`, que espera a resposta chegar, e o segundo no `.json()`, que espera o corpo virar objeto. Esquecer o segundo é o erro mais comum — você fica com uma Promise no lugar dos dados.',
    solucao: 'async function buscarNomeDoUsuario(id) {\n  const resposta = await fetch("https://jsonplaceholder.typicode.com/users/" + id);\n  const usuario = await resposta.json();\n  return usuario.name;\n}',
    explicacao: [
      'A palavra `async` é o que permite usar `await` dentro da função.',
      'Faz a requisição e espera a resposta chegar. O `+ id` monta a URL com o número recebido.',
      'Converte o corpo da resposta em objeto. Este `.json()` também demora, por isso leva `await`.',
      'Devolve só o campo pedido.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-04',
    nivel: 'deus',
    titulo: 'Buscar cidade pelo CEP',
    enunciado: 'Consulte um CEP na BrasilAPI e devolva o nome da cidade.\n\nAPI: https://brasilapi.com.br/api/cep/v1/01001000 — devolve um objeto com os campos `cep`, `state`, `city` e `street`.',
    parametros: 'Crie a função assíncrona `buscarCidade`, que recebe `cep` (texto, só números) e devolve o valor do campo `city`. Monte a URL juntando `https://brasilapi.com.br/api/cep/v1/` com o `cep` recebido.',
    assinatura: 'buscarCidade',
    assincrona: true,
    modelo: 'async function buscarCidade(cep) {\n  \n}',
    mockFetch: [
      { contem: '/cep/v1/01001000', resposta: { cep: '01001000', state: 'SP', city: 'São Paulo', street: 'Praça da Sé' } },
      { contem: '/cep/v1/30140071', resposta: { cep: '30140071', state: 'MG', city: 'Belo Horizonte', street: 'Rua da Bahia' } },
      { contem: '/cep/v1/80010010', resposta: { cep: '80010010', state: 'PR', city: 'Curitiba', street: 'Praça Tiradentes' } }
    ],
    testes: [
      { entrada: ['01001000'], esperado: 'São Paulo' },
      { entrada: ['30140071'], esperado: 'Belo Horizonte' },
      { entrada: ['80010010'], esperado: 'Curitiba' }
    ],
    dica: 'A estrutura é a mesma da questão do usuário: `await` no `fetch`, `await` no `.json()` e depois pega o campo. Só muda a URL e o nome do campo, que aqui é `city`.',
    solucao: 'async function buscarCidade(cep) {\n  const resposta = await fetch("https://brasilapi.com.br/api/cep/v1/" + cep);\n  const dados = await resposta.json();\n  return dados.city;\n}',
    explicacao: [
      'Função assíncrona recebendo o CEP.',
      'Monta a URL com o CEP e espera a resposta da API.',
      'Espera o corpo da resposta virar objeto.',
      'Devolve o campo `city`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-05',
    nivel: 'deus',
    titulo: 'Buscar vários usuários de uma vez',
    enunciado: 'Busque vários usuários na API e devolva a lista com os nomes deles, na mesma ordem dos ids recebidos.\n\nAPI: https://jsonplaceholder.typicode.com/users/1',
    parametros: 'Crie a função assíncrona `buscarVariosNomes`, que recebe `ids` (uma lista de números) e devolve uma lista com os nomes correspondentes. As buscas devem acontecer ao mesmo tempo, não uma esperando a outra.',
    assinatura: 'buscarVariosNomes',
    assincrona: true,
    modelo: 'async function buscarVariosNomes(ids) {\n  \n}',
    mockFetch: [
      { contem: '/users/1', resposta: { id: 1, name: 'Leanne Graham' } },
      { contem: '/users/2', resposta: { id: 2, name: 'Ervin Howell' } },
      { contem: '/users/3', resposta: { id: 3, name: 'Clementine Bauch' } }
    ],
    testes: [
      { entrada: [[1, 2, 3]], esperado: ['Leanne Graham', 'Ervin Howell', 'Clementine Bauch'] },
      { entrada: [[2]], esperado: ['Ervin Howell'] },
      { entrada: [[]], esperado: [] },
      { entrada: [[3, 1]], esperado: ['Clementine Bauch', 'Leanne Graham'] }
    ],
    dica: '`Promise.all` recebe uma lista de Promises e espera todas terminarem, devolvendo os resultados na mesma ordem. Use `map` para transformar cada id em uma Promise de busca e entregue essa lista ao `Promise.all`. Se você usar `await` dentro de um `for`, funciona — mas aí uma busca espera a outra, que é justamente o que o enunciado pede para evitar.',
    solucao: 'async function buscarVariosNomes(ids) {\n  const buscas = ids.map(function (id) {\n    return fetch("https://jsonplaceholder.typicode.com/users/" + id)\n      .then(function (resposta) { return resposta.json(); })\n      .then(function (usuario) { return usuario.name; });\n  });\n  return Promise.all(buscas);\n}',
    explicacao: [
      'Função assíncrona recebendo a lista de ids.',
      '`map` transforma cada id em uma Promise. Repare que aqui não há `await`: as buscas são disparadas todas juntas.',
      'Dispara a requisição do id da vez.',
      'Quando a resposta chega, converte para objeto.',
      'Quando o objeto está pronto, extrai o nome.',
      'Fecha o `map` — o resultado é uma lista de Promises.',
      '`Promise.all` espera todas terminarem e devolve os nomes na mesma ordem dos ids.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-06',
    nivel: 'deus',
    titulo: 'Classe Fila',
    enunciado: 'Implemente uma fila: uma estrutura onde o primeiro que entra é o primeiro que sai, como uma fila de banco. É o contrário da pilha.',
    parametros: 'Crie a classe `Fila`. O construtor começa vazia. Métodos: `entrar(item)` coloca no fim; `sair()` remove e devolve o primeiro; `primeiro()` devolve o primeiro sem remover; `tamanho()` devolve quantos há. Sair de uma fila vazia devolve `undefined`.',
    assinatura: 'Fila',
    modelo: 'class Fila {\n  constructor() {\n    \n  }\n\n  entrar(item) {\n    \n  }\n\n  sair() {\n    \n  }\n\n  primeiro() {\n    \n  }\n\n  tamanho() {\n    \n  }\n}',
    testes: [
      { chamada: 'const f = new Fila(); f.entrar(1); f.entrar(2); return f.primeiro();', esperado: 1 },
      { chamada: 'const f = new Fila(); f.entrar("a"); f.entrar("b"); return f.sair();', esperado: 'a' },
      { chamada: 'const f = new Fila(); f.entrar(1); f.entrar(2); f.sair(); return f.tamanho();', esperado: 1 },
      { chamada: 'const f = new Fila(); return f.sair();', esperado: undefined },
      { chamada: 'const f = new Fila(); f.entrar(1); f.entrar(2); f.sair(); return f.primeiro();', esperado: 2 }
    ],
    dica: 'A diferença para a pilha está em qual ponta sai. Aqui entra no fim com `push`, mas sai do começo com `shift`, que remove o primeiro item e devolve ele.',
    solucao: 'class Fila {\n  constructor() {\n    this.itens = [];\n  }\n\n  entrar(item) {\n    this.itens.push(item);\n  }\n\n  sair() {\n    return this.itens.shift();\n  }\n\n  primeiro() {\n    return this.itens[0];\n  }\n\n  tamanho() {\n    return this.itens.length;\n  }\n}',
    explicacao: [
      'Declara a classe.',
      'Construtor.',
      'Cria a lista vazia.',
      'Fecha o construtor.',
      '(linha em branco)',
      'Método para entrar na fila.',
      '`push` coloca no fim, que é onde a fila cresce.',
      'Fecha o método.',
      '(linha em branco)',
      'Método para sair da fila.',
      '`shift` remove o primeiro item e devolve ele. É aqui que a fila difere da pilha, que usaria `pop`.',
      'Fecha o método.',
      '(linha em branco)',
      'Método para ver quem é o próximo.',
      'Devolve o item da posição 0, sem remover.',
      'Fecha o método.',
      '(linha em branco)',
      'Método de tamanho.',
      'Devolve quantos itens há.',
      'Fecha o método.',
      'Fecha a classe.'
    ]
  },
  {
    id: 'deus-07',
    nivel: 'deus',
    titulo: 'Classe Retangulo',
    enunciado: 'Crie um retângulo que saiba calcular a própria área e o próprio perímetro.',
    parametros: 'Crie a classe `Retangulo`. O construtor recebe `base` e `altura` e guarda os dois. Métodos: `area()` devolve base vezes altura, e `perimetro()` devolve a soma dos quatro lados.',
    assinatura: 'Retangulo',
    modelo: 'class Retangulo {\n  constructor(base, altura) {\n    \n  }\n\n  area() {\n    \n  }\n\n  perimetro() {\n    \n  }\n}',
    testes: [
      { chamada: 'const r = new Retangulo(4, 5); return r.area();', esperado: 20 },
      { chamada: 'const r = new Retangulo(4, 5); return r.perimetro();', esperado: 18 },
      { chamada: 'const r = new Retangulo(1, 1); return r.area();', esperado: 1 },
      { chamada: 'const r = new Retangulo(10, 2); return r.perimetro();', esperado: 24 }
    ],
    dica: 'Guarde as duas medidas em `this` no construtor, para que os métodos possam usá-las depois. O perímetro é `2 * (base + altura)` — os parênteses são obrigatórios aqui.',
    solucao: 'class Retangulo {\n  constructor(base, altura) {\n    this.base = base;\n    this.altura = altura;\n  }\n\n  area() {\n    return this.base * this.altura;\n  }\n\n  perimetro() {\n    return 2 * (this.base + this.altura);\n  }\n}',
    explicacao: [
      'Declara a classe.',
      'Construtor recebendo as duas medidas.',
      'Guarda a base.',
      'Guarda a altura.',
      'Fecha o construtor.',
      '(linha em branco)',
      'Método de área.',
      'Multiplica os dois valores guardados. Precisa do `this` para alcançá-los.',
      'Fecha o método.',
      '(linha em branco)',
      'Método de perímetro.',
      'Soma base e altura, depois multiplica por 2. Sem os parênteses, só a base seria dobrada.',
      'Fecha o método.',
      'Fecha a classe.'
    ]
  },
  {
    id: 'deus-08',
    nivel: 'deus',
    titulo: 'Herança entre classes',
    enunciado: 'Crie uma classe que herda de outra e aproveita o comportamento dela, acrescentando algo.',
    parametros: 'Crie a classe `Pessoa`, cujo construtor recebe `nome` e que tem o método `apresentar()` devolvendo `"Oi, sou "` mais o nome. Depois crie a classe `Estudante`, que herda de `Pessoa`, recebe `nome` e `curso`, e cujo `apresentar()` devolve o texto da classe mãe seguido de `" e estudo "` mais o curso.',
    assinatura: 'Estudante',
    modelo: 'class Pessoa {\n  constructor(nome) {\n    \n  }\n\n  apresentar() {\n    \n  }\n}\n\nclass Estudante extends Pessoa {\n  constructor(nome, curso) {\n    \n  }\n\n  apresentar() {\n    \n  }\n}',
    testes: [
      { chamada: 'const p = new Pessoa("Ana"); return p.apresentar();', esperado: 'Oi, sou Ana' },
      { chamada: 'const e = new Estudante("Bia", "Direito"); return e.apresentar();', esperado: 'Oi, sou Bia e estudo Direito' },
      { chamada: 'const e = new Estudante("Caio", "Medicina"); return e.nome;', esperado: 'Caio' },
      { chamada: 'const e = new Estudante("Duda", "TI"); return e instanceof Pessoa;', esperado: true }
    ],
    dica: 'Duas palavras resolvem esta questão. `extends` liga a classe filha à mãe. E `super` faz duas coisas: dentro do construtor, `super(nome)` chama o construtor da mãe — e precisa vir antes de qualquer uso do `this`; dentro de um método, `super.apresentar()` chama a versão da mãe daquele método.',
    solucao: 'class Pessoa {\n  constructor(nome) {\n    this.nome = nome;\n  }\n\n  apresentar() {\n    return "Oi, sou " + this.nome;\n  }\n}\n\nclass Estudante extends Pessoa {\n  constructor(nome, curso) {\n    super(nome);\n    this.curso = curso;\n  }\n\n  apresentar() {\n    return super.apresentar() + " e estudo " + this.curso;\n  }\n}',
    explicacao: [
      'Declara a classe mãe.',
      'Construtor da mãe.',
      'Guarda o nome.',
      'Fecha o construtor.',
      '(linha em branco)',
      'Método de apresentação da mãe.',
      'Monta o texto básico.',
      'Fecha o método.',
      'Fecha a classe mãe.',
      '(linha em branco)',
      '`extends` declara que Estudante é um tipo de Pessoa — é isso que faz o `instanceof` do último teste dar `true`.',
      'Construtor da filha, recebendo os dois dados.',
      '`super(nome)` chama o construtor da mãe, que guarda o nome. Precisa vir antes do `this`, senão o JavaScript acusa erro.',
      'Agora sim guarda o campo próprio da filha.',
      'Fecha o construtor.',
      '(linha em branco)',
      'A filha redefine o método da mãe.',
      '`super.apresentar()` reaproveita o texto da mãe em vez de repetir aquele código, e acrescenta a parte nova.',
      'Fecha o método.',
      'Fecha a classe filha.'
    ]
  },
  {
    id: 'deus-09',
    nivel: 'deus',
    titulo: 'Classe Carrinho de compras',
    enunciado: 'Crie um carrinho de compras que guarda itens e sabe calcular o próprio total.',
    parametros: 'Crie a classe `Carrinho`. O construtor começa vazio. Métodos: `adicionar(nome, preco, quantidade)` guarda um item; `total()` devolve a soma de preço vezes quantidade de todos os itens; `quantidadeDeItens()` devolve quantos itens diferentes foram adicionados. Carrinho vazio tem total 0.',
    assinatura: 'Carrinho',
    modelo: 'class Carrinho {\n  constructor() {\n    \n  }\n\n  adicionar(nome, preco, quantidade) {\n    \n  }\n\n  total() {\n    \n  }\n\n  quantidadeDeItens() {\n    \n  }\n}',
    testes: [
      { chamada: 'const c = new Carrinho(); c.adicionar("pao", 5, 2); return c.total();', esperado: 10 },
      { chamada: 'const c = new Carrinho(); c.adicionar("pao", 5, 2); c.adicionar("leite", 4, 3); return c.total();', esperado: 22 },
      { chamada: 'const c = new Carrinho(); return c.total();', esperado: 0 },
      { chamada: 'const c = new Carrinho(); c.adicionar("a", 1, 1); c.adicionar("b", 2, 1); return c.quantidadeDeItens();', esperado: 2 }
    ],
    dica: 'Guarde os itens numa lista dentro de `this`, cada um como um objeto com os três dados. No `total()`, use `reduce` sobre essa lista multiplicando preço por quantidade — começando de 0, para o carrinho vazio dar 0.',
    solucao: 'class Carrinho {\n  constructor() {\n    this.itens = [];\n  }\n\n  adicionar(nome, preco, quantidade) {\n    this.itens.push({ nome: nome, preco: preco, quantidade: quantidade });\n  }\n\n  total() {\n    return this.itens.reduce(function (soma, item) {\n      return soma + item.preco * item.quantidade;\n    }, 0);\n  }\n\n  quantidadeDeItens() {\n    return this.itens.length;\n  }\n}',
    explicacao: [
      'Declara a classe.',
      'Construtor.',
      'Cria a lista de itens vazia.',
      'Fecha o construtor.',
      '(linha em branco)',
      'Método para adicionar um item.',
      'Monta um objeto com os três dados e guarda na lista.',
      'Fecha o método.',
      '(linha em branco)',
      'Método que calcula o total.',
      '`reduce` percorre os itens acumulando a soma.',
      'Multiplica preço por quantidade antes de somar.',
      'O `0` inicial é o que faz o carrinho vazio devolver 0.',
      'Fecha o método.',
      '(linha em branco)',
      'Método de contagem.',
      'Devolve quantos itens a lista tem.',
      'Fecha o método.',
      'Fecha a classe.'
    ]
  },
  {
    id: 'deus-10',
    nivel: 'deus',
    titulo: 'Getter e setter',
    enunciado: 'Crie um termômetro que guarda a temperatura em Celsius, mas permite ler e escrever em Fahrenheit como se fosse uma propriedade comum.',
    parametros: 'Crie a classe `Termometro`. O construtor recebe a temperatura em Celsius e guarda em `this.celsius`. Crie um getter `fahrenheit`, que devolve a temperatura convertida (Celsius vezes 9, dividido por 5, mais 32), e um setter `fahrenheit`, que recebe um valor em Fahrenheit e atualiza `this.celsius` (valor menos 32, vezes 5, dividido por 9).',
    assinatura: 'Termometro',
    modelo: 'class Termometro {\n  constructor(celsius) {\n    \n  }\n\n  get fahrenheit() {\n    \n  }\n\n  set fahrenheit(valor) {\n    \n  }\n}',
    testes: [
      { chamada: 'const t = new Termometro(100); return t.fahrenheit;', esperado: 212 },
      { chamada: 'const t = new Termometro(0); return t.fahrenheit;', esperado: 32 },
      { chamada: 'const t = new Termometro(0); t.fahrenheit = 212; return t.celsius;', esperado: 100 },
      { chamada: 'const t = new Termometro(50); t.fahrenheit = 32; return t.celsius;', esperado: 0 }
    ],
    dica: 'Getter e setter são métodos que se usam sem parênteses, como se fossem propriedades: `t.fahrenheit` chama o getter e `t.fahrenheit = 212` chama o setter. Repare que nos testes nunca aparecem parênteses depois de `fahrenheit` — é essa a diferença para um método comum.',
    solucao: 'class Termometro {\n  constructor(celsius) {\n    this.celsius = celsius;\n  }\n\n  get fahrenheit() {\n    return this.celsius * 9 / 5 + 32;\n  }\n\n  set fahrenheit(valor) {\n    this.celsius = (valor - 32) * 5 / 9;\n  }\n}',
    explicacao: [
      'Declara a classe.',
      'Construtor recebendo Celsius.',
      'Guarda o valor. Só o Celsius é armazenado; o Fahrenheit é sempre calculado na hora.',
      'Fecha o construtor.',
      '(linha em branco)',
      'A palavra `get` transforma este método em leitura de propriedade.',
      'Faz a conversão e devolve.',
      'Fecha o getter.',
      '(linha em branco)',
      'A palavra `set` transforma este método em escrita de propriedade. O `valor` é o que veio depois do sinal de igual.',
      'Converte de volta para Celsius e guarda. Os parênteses garantem que a subtração aconteça antes da multiplicação.',
      'Fecha o setter.',
      'Fecha a classe.'
    ]
  },
  {
    id: 'deus-11',
    nivel: 'deus',
    titulo: 'Métodos estáticos',
    enunciado: 'Crie uma calculadora cujos métodos são chamados direto na classe, sem precisar criar um objeto com `new`.',
    parametros: 'Crie a classe `Calculadora` com os métodos estáticos `somar(a, b)`, `subtrair(a, b)`, `multiplicar(a, b)` e `dividir(a, b)`. Se a divisão for por zero, `dividir` devolve o texto `"não dá"`.',
    assinatura: 'Calculadora',
    modelo: 'class Calculadora {\n  static somar(a, b) {\n    \n  }\n\n  static subtrair(a, b) {\n    \n  }\n\n  static multiplicar(a, b) {\n    \n  }\n\n  static dividir(a, b) {\n    \n  }\n}',
    testes: [
      { chamada: 'return Calculadora.somar(2, 3);', esperado: 5 },
      { chamada: 'return Calculadora.subtrair(10, 4);', esperado: 6 },
      { chamada: 'return Calculadora.multiplicar(3, 4);', esperado: 12 },
      { chamada: 'return Calculadora.dividir(10, 2);', esperado: 5 },
      { chamada: 'return Calculadora.dividir(10, 0);', esperado: 'não dá' }
    ],
    dica: 'A palavra `static` faz o método pertencer à classe e não aos objetos criados a partir dela. Por isso os testes chamam `Calculadora.somar(...)` diretamente, sem nenhum `new`. Como não há objeto, também não existe `this` para usar aqui.',
    solucao: 'class Calculadora {\n  static somar(a, b) {\n    return a + b;\n  }\n\n  static subtrair(a, b) {\n    return a - b;\n  }\n\n  static multiplicar(a, b) {\n    return a * b;\n  }\n\n  static dividir(a, b) {\n    if (b === 0) {\n      return "não dá";\n    }\n    return a / b;\n  }\n}',
    explicacao: [
      'Declara a classe.',
      '`static` faz o método ser chamado na própria classe.',
      'Soma e devolve.',
      'Fecha o método.',
      '(linha em branco)',
      'Método estático de subtração.',
      'Subtrai e devolve.',
      'Fecha o método.',
      '(linha em branco)',
      'Método estático de multiplicação.',
      'Multiplica e devolve.',
      'Fecha o método.',
      '(linha em branco)',
      'Método estático de divisão.',
      'Verifica o divisor zero antes de dividir.',
      'Devolve o aviso e encerra. Sem esse cuidado, JavaScript devolveria `Infinity` em vez de erro.',
      'Fecha o `if`.',
      'Divisão normal quando o divisor não é zero.',
      'Fecha o método.',
      'Fecha a classe.'
    ]
  },
  {
    id: 'deus-12',
    nivel: 'deus',
    titulo: 'Quantos posts o usuário tem',
    enunciado: 'Descubra quantos posts um usuário publicou.\n\nAPI: https://jsonplaceholder.typicode.com/posts?userId=1 — devolve uma lista de posts daquele usuário.',
    parametros: 'Crie a função assíncrona `buscarQuantidadeDePosts`, que recebe `id` e devolve quantos posts esse usuário tem. Monte a URL juntando `https://jsonplaceholder.typicode.com/posts?userId=` com o `id`.',
    assinatura: 'buscarQuantidadeDePosts',
    assincrona: true,
    modelo: 'async function buscarQuantidadeDePosts(id) {\n  \n}',
    mockFetch: [
      { contem: 'posts?userId=1', resposta: [{ id: 1, title: 'primeiro' }, { id: 2, title: 'segundo' }, { id: 3, title: 'terceiro' }] },
      { contem: 'posts?userId=2', resposta: [{ id: 4, title: 'outro' }] },
      { contem: 'posts?userId=3', resposta: [] }
    ],
    testes: [
      { entrada: [1], esperado: 3 },
      { entrada: [2], esperado: 1 },
      { entrada: [3], esperado: 0 }
    ],
    dica: 'Desta vez a API devolve uma lista, não um objeto. Depois do `await resposta.json()`, você tem um array nas mãos — então basta devolver o `length` dele.',
    solucao: 'async function buscarQuantidadeDePosts(id) {\n  const resposta = await fetch("https://jsonplaceholder.typicode.com/posts?userId=" + id);\n  const posts = await resposta.json();\n  return posts.length;\n}',
    explicacao: [
      'Função assíncrona recebendo o id do usuário.',
      'Monta a URL com o parâmetro de busca e espera a resposta.',
      'Converte o corpo em lista.',
      'Devolve o tamanho da lista.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-13',
    nivel: 'deus',
    titulo: 'Títulos dos posts',
    enunciado: 'Busque os posts de um usuário e devolva só os títulos.\n\nAPI: https://jsonplaceholder.typicode.com/posts?userId=1 — cada post da lista tem um campo `title`.',
    parametros: 'Crie a função assíncrona `buscarTitulosDosPosts`, que recebe `id` e devolve uma lista só com os títulos dos posts daquele usuário.',
    assinatura: 'buscarTitulosDosPosts',
    assincrona: true,
    modelo: 'async function buscarTitulosDosPosts(id) {\n  \n}',
    mockFetch: [
      { contem: 'posts?userId=1', resposta: [{ id: 1, title: 'primeiro' }, { id: 2, title: 'segundo' }] },
      { contem: 'posts?userId=2', resposta: [{ id: 3, title: 'sozinho' }] },
      { contem: 'posts?userId=3', resposta: [] }
    ],
    testes: [
      { entrada: [1], esperado: ['primeiro', 'segundo'] },
      { entrada: [2], esperado: ['sozinho'] },
      { entrada: [3], esperado: [] }
    ],
    dica: 'Junta duas coisas que você já sabe: a busca assíncrona e o `map`. Depois de converter a resposta em lista, use `map` para trocar cada post pelo campo `title` dele.',
    solucao: 'async function buscarTitulosDosPosts(id) {\n  const resposta = await fetch("https://jsonplaceholder.typicode.com/posts?userId=" + id);\n  const posts = await resposta.json();\n  return posts.map(function (post) {\n    return post.title;\n  });\n}',
    explicacao: [
      'Função assíncrona recebendo o id.',
      'Busca os posts do usuário.',
      'Converte o corpo em lista de objetos.',
      '`map` percorre a lista trocando cada objeto pelo título.',
      'Devolve o campo `title` de cada post.',
      'Fecha o `map` e devolve a lista de títulos.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-14',
    nivel: 'deus',
    titulo: 'E-mail do usuário',
    enunciado: 'Busque um usuário na API e devolva o e-mail dele, sempre em letras minúsculas.\n\nAPI: https://jsonplaceholder.typicode.com/users/1 — o objeto tem o campo `email`.',
    parametros: 'Crie a função assíncrona `buscarEmailDoUsuario`, que recebe `id` e devolve o campo `email` do usuário, convertido para minúsculas.',
    assinatura: 'buscarEmailDoUsuario',
    assincrona: true,
    modelo: 'async function buscarEmailDoUsuario(id) {\n  \n}',
    mockFetch: [
      { contem: '/users/1', resposta: { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' } },
      { contem: '/users/2', resposta: { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv' } }
    ],
    testes: [
      { entrada: [1], esperado: 'sincere@april.biz' },
      { entrada: [2], esperado: 'shanna@melissa.tv' }
    ],
    dica: 'A busca é a mesma de sempre. A pegadinha está no fim: os e-mails dessa API vêm com letra maiúscula no começo, então não esqueça do `toLowerCase()` antes de devolver.',
    solucao: 'async function buscarEmailDoUsuario(id) {\n  const resposta = await fetch("https://jsonplaceholder.typicode.com/users/" + id);\n  const usuario = await resposta.json();\n  return usuario.email.toLowerCase();\n}',
    explicacao: [
      'Função assíncrona recebendo o id.',
      'Busca o usuário.',
      'Converte a resposta em objeto.',
      'Pega o e-mail e já devolve em minúsculas, como o enunciado pede.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-15',
    nivel: 'deus',
    titulo: 'Estado pelo DDD',
    enunciado: 'Descubra a qual estado pertence um DDD.\n\nAPI: https://brasilapi.com.br/api/ddd/v1/11 — devolve um objeto com os campos `state` e `cities`.',
    parametros: 'Crie a função assíncrona `buscarEstadoDoDDD`, que recebe `ddd` e devolve a sigla do estado (campo `state`). Monte a URL juntando `https://brasilapi.com.br/api/ddd/v1/` com o `ddd`.',
    assinatura: 'buscarEstadoDoDDD',
    assincrona: true,
    modelo: 'async function buscarEstadoDoDDD(ddd) {\n  \n}',
    mockFetch: [
      { contem: '/ddd/v1/11', resposta: { state: 'SP', cities: ['SAO PAULO', 'GUARULHOS'] } },
      { contem: '/ddd/v1/21', resposta: { state: 'RJ', cities: ['RIO DE JANEIRO'] } },
      { contem: '/ddd/v1/31', resposta: { state: 'MG', cities: ['BELO HORIZONTE'] } }
    ],
    testes: [
      { entrada: [11], esperado: 'SP' },
      { entrada: [21], esperado: 'RJ' },
      { entrada: [31], esperado: 'MG' }
    ],
    dica: 'Mesmo formato das outras buscas na BrasilAPI. Só muda o caminho da URL e o nome do campo, que aqui é `state`.',
    solucao: 'async function buscarEstadoDoDDD(ddd) {\n  const resposta = await fetch("https://brasilapi.com.br/api/ddd/v1/" + ddd);\n  const dados = await resposta.json();\n  return dados.state;\n}',
    explicacao: [
      'Função assíncrona recebendo o DDD.',
      'Monta a URL e busca.',
      'Converte a resposta em objeto.',
      'Devolve a sigla do estado.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-16',
    nivel: 'deus',
    titulo: 'Nome do banco pelo código',
    enunciado: 'Descubra o nome de um banco a partir do código dele.\n\nAPI: https://brasilapi.com.br/api/banks/v1/001 — devolve um objeto com os campos `name`, `fullName` e `code`.',
    parametros: 'Crie a função assíncrona `buscarNomeDoBanco`, que recebe `codigo` (texto) e devolve o campo `name`. Monte a URL juntando `https://brasilapi.com.br/api/banks/v1/` com o `codigo`.',
    assinatura: 'buscarNomeDoBanco',
    assincrona: true,
    modelo: 'async function buscarNomeDoBanco(codigo) {\n  \n}',
    mockFetch: [
      { contem: '/banks/v1/001', resposta: { code: 1, name: 'BCO DO BRASIL S.A.', fullName: 'Banco do Brasil S.A.' } },
      { contem: '/banks/v1/237', resposta: { code: 237, name: 'BCO BRADESCO S.A.', fullName: 'Banco Bradesco S.A.' } },
      { contem: '/banks/v1/341', resposta: { code: 341, name: 'ITAÚ UNIBANCO S.A.', fullName: 'Itaú Unibanco S.A.' } }
    ],
    testes: [
      { entrada: ['001'], esperado: 'BCO DO BRASIL S.A.' },
      { entrada: ['237'], esperado: 'BCO BRADESCO S.A.' },
      { entrada: ['341'], esperado: 'ITAÚ UNIBANCO S.A.' }
    ],
    dica: 'Repare que o código vem como texto, com os zeros da frente — "001" e não 1. Junte ele na URL do jeito que chegou, sem converter para número, senão os zeros somem.',
    solucao: 'async function buscarNomeDoBanco(codigo) {\n  const resposta = await fetch("https://brasilapi.com.br/api/banks/v1/" + codigo);\n  const banco = await resposta.json();\n  return banco.name;\n}',
    explicacao: [
      'Função assíncrona recebendo o código do banco.',
      'Monta a URL mantendo o código como texto.',
      'Converte a resposta em objeto.',
      'Devolve o nome curto do banco — o campo `name`, não o `fullName`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-17',
    nivel: 'deus',
    titulo: 'Quantos feriados no ano',
    enunciado: 'Descubra quantos feriados nacionais um ano tem.\n\nAPI: https://brasilapi.com.br/api/feriados/v1/2024 — devolve uma lista de feriados.',
    parametros: 'Crie a função assíncrona `contarFeriados`, que recebe `ano` e devolve quantos feriados existem naquele ano. Monte a URL juntando `https://brasilapi.com.br/api/feriados/v1/` com o `ano`.',
    assinatura: 'contarFeriados',
    assincrona: true,
    modelo: 'async function contarFeriados(ano) {\n  \n}',
    mockFetch: [
      { contem: '/feriados/v1/2024', resposta: [{ date: '2024-01-01', name: 'Confraternização mundial' }, { date: '2024-04-21', name: 'Tiradentes' }, { date: '2024-09-07', name: 'Independência do Brasil' }] },
      { contem: '/feriados/v1/2025', resposta: [{ date: '2025-01-01', name: 'Confraternização mundial' }, { date: '2025-04-21', name: 'Tiradentes' }] }
    ],
    testes: [
      { entrada: [2024], esperado: 3 },
      { entrada: [2025], esperado: 2 }
    ],
    dica: 'A resposta é uma lista, então depois do `.json()` basta devolver o `length`. É o mesmo padrão de contar os posts de um usuário.',
    solucao: 'async function contarFeriados(ano) {\n  const resposta = await fetch("https://brasilapi.com.br/api/feriados/v1/" + ano);\n  const feriados = await resposta.json();\n  return feriados.length;\n}',
    explicacao: [
      'Função assíncrona recebendo o ano.',
      'Monta a URL e busca a lista de feriados.',
      'Converte o corpo em lista.',
      'Devolve quantos itens a lista tem.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-18',
    nivel: 'deus',
    titulo: 'Tratar resposta que deu errado',
    enunciado: 'Nem toda requisição encontra o que procura. Trate o caso em que a API responde que o usuário não existe.\n\nAPI: https://jsonplaceholder.typicode.com/users/1',
    parametros: 'Crie a função assíncrona `buscarComSeguranca`, que recebe `id` e devolve o `name` do usuário. Se a resposta não tiver dado certo — ou seja, se `resposta.ok` for falso —, devolva o texto `"usuário não encontrado"` sem tentar ler o corpo.',
    assinatura: 'buscarComSeguranca',
    assincrona: true,
    modelo: 'async function buscarComSeguranca(id) {\n  \n}',
    mockFetch: [
      { contem: '/users/1', resposta: { id: 1, name: 'Leanne Graham' } },
      { contem: '/users/2', resposta: { id: 2, name: 'Ervin Howell' } },
      { contem: '/users/999', ok: false, status: 404, resposta: {} }
    ],
    testes: [
      { entrada: [1], esperado: 'Leanne Graham' },
      { entrada: [2], esperado: 'Ervin Howell' },
      { entrada: [999], esperado: 'usuário não encontrado' }
    ],
    dica: 'O `fetch` não lança erro quando a API responde 404 — ele entrega a resposta normalmente, só que com `resposta.ok` valendo `false`. Por isso você precisa verificar isso na mão, logo depois do `await fetch`, antes de chamar o `.json()`.',
    solucao: 'async function buscarComSeguranca(id) {\n  const resposta = await fetch("https://jsonplaceholder.typicode.com/users/" + id);\n  if (!resposta.ok) {\n    return "usuário não encontrado";\n  }\n  const usuario = await resposta.json();\n  return usuario.name;\n}',
    explicacao: [
      'Função assíncrona recebendo o id.',
      'Faz a requisição e espera a resposta.',
      'Verifica se a resposta deu certo. O `!` inverte: entra no bloco quando NÃO deu certo.',
      'Sai devolvendo o aviso, sem nem tentar ler o corpo.',
      'Fecha o `if`.',
      'Só chega aqui quando a resposta é válida.',
      'Devolve o nome.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-19',
    nivel: 'deus',
    titulo: 'Criar uma Promise do zero',
    enunciado: 'Crie uma função que espera uma quantidade de tempo antes de continuar. É o equivalente a um "pause" que funciona com `await`.',
    parametros: 'Crie a função `esperar`, que recebe `ms` (milissegundos) e devolve uma Promise que termina depois desse tempo. Ela não precisa devolver nenhum valor, só terminar.',
    assinatura: 'esperar',
    assincrona: true,
    modelo: 'function esperar(ms) {\n  \n}',
    testes: [
      { chamada: 'const t = Date.now(); await esperar(60); return Date.now() - t >= 50;', esperado: true },
      { chamada: 'return esperar(10) instanceof Promise;', esperado: true },
      { chamada: 'const r = await esperar(10); return r;', esperado: undefined }
    ],
    dica: 'Use `new Promise`, que recebe uma função com o parâmetro `resolver` (também chamado de `resolve`). Chamar `resolver()` é o que faz a Promise terminar. Como você quer que isso aconteça depois de um tempo, entregue o `resolver` direto para o `setTimeout`.',
    solucao: 'function esperar(ms) {\n  return new Promise(function (resolver) {\n    setTimeout(resolver, ms);\n  });\n}',
    explicacao: [
      'Repare que esta função não precisa ser `async`: ela não usa `await`, ela cria a Promise.',
      '`new Promise` recebe uma função que descreve quando a espera termina.',
      'Entrega o `resolver` ao `setTimeout`. Quando o tempo passar, ele será chamado e a Promise termina. Sem chamar `resolver`, a Promise ficaria pendurada para sempre.',
      'Fecha a Promise e devolve ela.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-20',
    nivel: 'deus',
    titulo: 'Somar posts de vários usuários',
    enunciado: 'Descubra o total de posts publicados por um grupo de usuários, somando tudo.\n\nAPI: https://jsonplaceholder.typicode.com/posts?userId=1',
    parametros: 'Crie a função assíncrona `somarPostsDeVariosUsuarios`, que recebe `ids` (uma lista) e devolve o total de posts de todos eles somados. Lista vazia devolve 0.',
    assinatura: 'somarPostsDeVariosUsuarios',
    assincrona: true,
    modelo: 'async function somarPostsDeVariosUsuarios(ids) {\n  \n}',
    mockFetch: [
      { contem: 'posts?userId=1', resposta: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      { contem: 'posts?userId=2', resposta: [{ id: 4 }] },
      { contem: 'posts?userId=3', resposta: [{ id: 5 }, { id: 6 }] }
    ],
    testes: [
      { entrada: [[1, 2]], esperado: 4 },
      { entrada: [[1, 2, 3]], esperado: 6 },
      { entrada: [[2]], esperado: 1 },
      { entrada: [[]], esperado: 0 }
    ],
    dica: 'Combine três coisas: `map` para virar cada id em uma Promise que devolve a quantidade, `Promise.all` para esperar todas, e `reduce` para somar os números que voltaram. O `reduce` acontece depois do `await`, quando você já tem uma lista de números comum.',
    solucao: 'async function somarPostsDeVariosUsuarios(ids) {\n  const buscas = ids.map(function (id) {\n    return fetch("https://jsonplaceholder.typicode.com/posts?userId=" + id)\n      .then(function (resposta) { return resposta.json(); })\n      .then(function (posts) { return posts.length; });\n  });\n  const quantidades = await Promise.all(buscas);\n  return quantidades.reduce(function (total, n) { return total + n; }, 0);\n}',
    explicacao: [
      'Função assíncrona recebendo a lista de ids.',
      '`map` monta uma Promise para cada id, todas disparadas juntas.',
      'Busca os posts daquele usuário.',
      'Converte a resposta em lista.',
      'Transforma a lista na quantidade dela.',
      'Fecha o `map`.',
      '`await Promise.all` espera todas e devolve uma lista de números.',
      'A partir daqui é código comum: `reduce` soma os números, partindo de 0.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-21',
    nivel: 'deus',
    titulo: 'Buscar com valor padrão',
    enunciado: 'Faça uma busca que não quebra quando a requisição falha: em vez de estourar erro, devolve um valor padrão.',
    parametros: 'Crie a função assíncrona `buscarNomeOuPadrao`, que recebe `id` e devolve o `name` do usuário. Se a requisição falhar por qualquer motivo, devolva o texto `"desconhecido"`.',
    assinatura: 'buscarNomeOuPadrao',
    assincrona: true,
    modelo: 'async function buscarNomeOuPadrao(id) {\n  \n}',
    mockFetch: [
      { contem: '/users/1', resposta: { id: 1, name: 'Leanne Graham' } },
      { contem: '/users/2', resposta: { id: 2, name: 'Ervin Howell' } }
    ],
    testes: [
      { entrada: [1], esperado: 'Leanne Graham' },
      { entrada: [2], esperado: 'Ervin Howell' },
      { entrada: [42], esperado: 'desconhecido' }
    ],
    dica: 'Envolva a busca em `try` e coloque o valor padrão no `catch`. Diferente da questão do `resposta.ok`, aqui a falha é da própria requisição — ela nem chega a virar resposta —, e é isso que o `catch` pega.',
    solucao: 'async function buscarNomeOuPadrao(id) {\n  try {\n    const resposta = await fetch("https://jsonplaceholder.typicode.com/users/" + id);\n    const usuario = await resposta.json();\n    return usuario.name;\n  } catch (erro) {\n    return "desconhecido";\n  }\n}',
    explicacao: [
      'Função assíncrona recebendo o id.',
      'O `try` marca o trecho que pode falhar.',
      'Faz a requisição — é aqui que o erro acontece quando o endereço não responde.',
      'Converte a resposta.',
      'Caminho feliz: devolve o nome.',
      'O `catch` recebe o erro e assume o controle quando algo dentro do `try` falha.',
      'Devolve o valor padrão em vez de deixar o erro subir.',
      'Fecha o `catch`.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-22',
    nivel: 'deus',
    titulo: 'Classe Estoque com Map',
    enunciado: 'Controle um estoque de produtos, somando as quantidades quando o mesmo produto entra mais de uma vez.',
    parametros: 'Crie a classe `Estoque` usando um `Map` internamente. O construtor começa vazio. Métodos: `adicionar(nome, quantidade)` soma à quantidade que já existia daquele produto; `quantidade(nome)` devolve quanto há do produto, ou 0 se ele não existe; `tipos()` devolve quantos produtos diferentes há.',
    assinatura: 'Estoque',
    modelo: 'class Estoque {\n  constructor() {\n    \n  }\n\n  adicionar(nome, quantidade) {\n    \n  }\n\n  quantidade(nome) {\n    \n  }\n\n  tipos() {\n    \n  }\n}',
    testes: [
      { chamada: 'const e = new Estoque(); e.adicionar("pao", 10); return e.quantidade("pao");', esperado: 10 },
      { chamada: 'const e = new Estoque(); e.adicionar("pao", 10); e.adicionar("pao", 5); return e.quantidade("pao");', esperado: 15 },
      { chamada: 'const e = new Estoque(); return e.quantidade("nada");', esperado: 0 },
      { chamada: 'const e = new Estoque(); e.adicionar("a", 1); e.adicionar("b", 1); return e.tipos();', esperado: 2 },
      { chamada: 'const e = new Estoque(); e.adicionar("a", 1); e.adicionar("a", 1); return e.tipos();', esperado: 1 }
    ],
    dica: '`Map` é parecido com objeto, mas com métodos próprios: `set(chave, valor)` grava, `get(chave)` lê e devolve `undefined` se não existir, e `size` é uma propriedade com a quantidade de chaves. O truque do `|| 0` continua servindo para a primeira vez que um produto aparece.',
    solucao: 'class Estoque {\n  constructor() {\n    this.itens = new Map();\n  }\n\n  adicionar(nome, quantidade) {\n    this.itens.set(nome, this.quantidade(nome) + quantidade);\n  }\n\n  quantidade(nome) {\n    return this.itens.get(nome) || 0;\n  }\n\n  tipos() {\n    return this.itens.size;\n  }\n}',
    explicacao: [
      'Declara a classe.',
      'Construtor.',
      'Cria o Map vazio.',
      'Fecha o construtor.',
      '(linha em branco)',
      'Método para adicionar ao estoque.',
      'Reaproveita o próprio método `quantidade` para pegar o valor atual e soma o novo. Como `quantidade` já resolve o caso do produto inédito, aqui não precisa de `if`.',
      'Fecha o método.',
      '(linha em branco)',
      'Método de consulta.',
      '`get` devolve `undefined` para produto que não existe, e o `|| 0` transforma isso em zero.',
      'Fecha o método.',
      '(linha em branco)',
      'Método de contagem de tipos.',
      '`size` é propriedade, então vai sem parênteses. Ela conta chaves distintas — por isso adicionar o mesmo produto duas vezes continua sendo um tipo só.',
      'Fecha o método.',
      'Fecha a classe.'
    ]
  },
  {
    id: 'deus-23',
    nivel: 'deus',
    titulo: 'Cidades de vários CEPs',
    enunciado: 'Consulte vários CEPs ao mesmo tempo e devolva a lista de cidades.\n\nAPI: https://brasilapi.com.br/api/cep/v1/01001000',
    parametros: 'Crie a função assíncrona `buscarCidadesDeVariosCeps`, que recebe `ceps` (uma lista de textos) e devolve uma lista com as cidades correspondentes, na mesma ordem. As buscas devem acontecer ao mesmo tempo.',
    assinatura: 'buscarCidadesDeVariosCeps',
    assincrona: true,
    modelo: 'async function buscarCidadesDeVariosCeps(ceps) {\n  \n}',
    mockFetch: [
      { contem: '/cep/v1/01001000', resposta: { cep: '01001000', state: 'SP', city: 'São Paulo' } },
      { contem: '/cep/v1/30140071', resposta: { cep: '30140071', state: 'MG', city: 'Belo Horizonte' } },
      { contem: '/cep/v1/80010010', resposta: { cep: '80010010', state: 'PR', city: 'Curitiba' } }
    ],
    testes: [
      { entrada: [['01001000', '30140071']], esperado: ['São Paulo', 'Belo Horizonte'] },
      { entrada: [['80010010']], esperado: ['Curitiba'] },
      { entrada: [[]], esperado: [] },
      { entrada: [['30140071', '01001000']], esperado: ['Belo Horizonte', 'São Paulo'] }
    ],
    dica: 'Mesmo padrão de buscar vários usuários: `map` para criar as Promises e `Promise.all` para esperar todas. O último teste existe justamente para conferir que a ordem do resultado acompanha a ordem da lista de entrada, e não a ordem em que as respostas chegaram.',
    solucao: 'async function buscarCidadesDeVariosCeps(ceps) {\n  const buscas = ceps.map(function (cep) {\n    return fetch("https://brasilapi.com.br/api/cep/v1/" + cep)\n      .then(function (resposta) { return resposta.json(); })\n      .then(function (dados) { return dados.city; });\n  });\n  return Promise.all(buscas);\n}',
    explicacao: [
      'Função assíncrona recebendo a lista de CEPs.',
      '`map` cria uma Promise por CEP, todas disparadas juntas.',
      'Busca o CEP da vez.',
      'Converte a resposta em objeto.',
      'Extrai só a cidade.',
      'Fecha o `map`.',
      '`Promise.all` devolve os resultados na ordem da lista original, mesmo que as respostas cheguem fora de ordem.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-24',
    nivel: 'deus',
    titulo: 'Agrupar posts por usuário',
    enunciado: 'Monte um resumo de quantos posts cada usuário tem, em um objeto.\n\nAPI: https://jsonplaceholder.typicode.com/posts?userId=1',
    parametros: 'Crie a função assíncrona `agruparPostsPorUsuario`, que recebe `ids` (uma lista) e devolve um objeto onde cada chave é um id e cada valor é a quantidade de posts daquele usuário. Exemplo: `{ 1: 3, 2: 1 }`. Lista vazia devolve objeto vazio.',
    assinatura: 'agruparPostsPorUsuario',
    assincrona: true,
    modelo: 'async function agruparPostsPorUsuario(ids) {\n  \n}',
    mockFetch: [
      { contem: 'posts?userId=1', resposta: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      { contem: 'posts?userId=2', resposta: [{ id: 4 }] },
      { contem: 'posts?userId=3', resposta: [{ id: 5 }, { id: 6 }] }
    ],
    testes: [
      { entrada: [[1, 2]], esperado: { 1: 3, 2: 1 } },
      { entrada: [[3]], esperado: { 3: 2 } },
      { entrada: [[]], esperado: {} },
      { entrada: [[1, 2, 3]], esperado: { 1: 3, 2: 1, 3: 2 } }
    ],
    dica: 'Busque todas as quantidades com `map` e `Promise.all`, e só depois monte o objeto. Com a lista de quantidades pronta e alinhada com a lista de ids, dá para percorrer os ids usando a posição para achar a quantidade correspondente.',
    solucao: 'async function agruparPostsPorUsuario(ids) {\n  const buscas = ids.map(function (id) {\n    return fetch("https://jsonplaceholder.typicode.com/posts?userId=" + id)\n      .then(function (resposta) { return resposta.json(); })\n      .then(function (posts) { return posts.length; });\n  });\n  const quantidades = await Promise.all(buscas);\n  const resumo = {};\n  ids.forEach(function (id, posicao) {\n    resumo[id] = quantidades[posicao];\n  });\n  return resumo;\n}',
    explicacao: [
      'Função assíncrona recebendo a lista de ids.',
      'Cria uma Promise por id.',
      'Busca os posts.',
      'Converte em lista.',
      'Guarda só a quantidade.',
      'Fecha o `map`.',
      'Espera todas as buscas terminarem.',
      'Cria o objeto de resumo vazio.',
      'Percorre os ids aproveitando o segundo parâmetro do `forEach`, que é a posição.',
      'Como `Promise.all` preserva a ordem, a posição do id é a mesma posição da quantidade dele.',
      'Fecha o `forEach`.',
      'Devolve o resumo.',
      'Fecha a função.'
    ]
  },
  {
    id: 'deus-25',
    nivel: 'deus',
    titulo: 'Nomes em ordem alfabética',
    enunciado: 'Busque vários usuários e devolva os nomes deles em ordem alfabética, não na ordem em que foram pedidos.\n\nAPI: https://jsonplaceholder.typicode.com/users/1',
    parametros: 'Crie a função assíncrona `buscarNomesOrdenados`, que recebe `ids` e devolve a lista de nomes ordenada em ordem alfabética.',
    assinatura: 'buscarNomesOrdenados',
    assincrona: true,
    modelo: 'async function buscarNomesOrdenados(ids) {\n  \n}',
    mockFetch: [
      { contem: '/users/1', resposta: { id: 1, name: 'Leanne Graham' } },
      { contem: '/users/2', resposta: { id: 2, name: 'Ervin Howell' } },
      { contem: '/users/3', resposta: { id: 3, name: 'Clementine Bauch' } }
    ],
    testes: [
      { entrada: [[1, 2, 3]], esperado: ['Clementine Bauch', 'Ervin Howell', 'Leanne Graham'] },
      { entrada: [[3, 1]], esperado: ['Clementine Bauch', 'Leanne Graham'] },
      { entrada: [[2]], esperado: ['Ervin Howell'] },
      { entrada: [[]], esperado: [] }
    ],
    dica: 'Primeiro busque tudo com `Promise.all`, depois ordene. Como são textos, `sort()` sem função de comparação já ordena alfabeticamente — a comparação por subtração só é necessária para números.',
    solucao: 'async function buscarNomesOrdenados(ids) {\n  const buscas = ids.map(function (id) {\n    return fetch("https://jsonplaceholder.typicode.com/users/" + id)\n      .then(function (resposta) { return resposta.json(); })\n      .then(function (usuario) { return usuario.name; });\n  });\n  const nomes = await Promise.all(buscas);\n  return nomes.sort();\n}',
    explicacao: [
      'Função assíncrona recebendo a lista de ids.',
      'Cria uma Promise por id.',
      'Busca o usuário.',
      'Converte a resposta.',
      'Extrai o nome.',
      'Fecha o `map`.',
      'Espera todas as buscas e recebe a lista de nomes na ordem dos ids.',
      '`sort()` reordena alfabeticamente. Para texto ele funciona sozinho; para número seria preciso passar a comparação.',
      'Fecha a função.'
    ]
  }
];

module.exports = QUESTOES_DEUS;
