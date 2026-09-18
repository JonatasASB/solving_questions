# PRD — Resolução de Questões

> Documento de requisitos derivado de [`dump.md`](./dump.md).
> O dump continua sendo o registro original da ideia e não deve ser editado; este PRD é o
> documento de execução.
>
> Itens marcados com **[decisão do PRD]** não estavam no dump — foram preenchidos aqui para
> fechar lacunas. São os pontos a revisar primeiro.

---

## 1. Visão geral

Site para **treinar lógica de programação resolvendo questões no navegador**. O usuário
escolhe a linguagem e o nível, lê o enunciado, escreve a solução em um editor embutido e
recebe correção automática, acumulando pontos conforme avança.

**Público:** iniciantes que estão aprendendo lógica e também quem já tem experiência e quer
manter a prática. As duas pontas são atendidas pela faixa de dificuldade, que vai de somar
dois números até POO e consumo de API.

**Referências de produto:** LeetCode e Beecrowd — mas com enunciado bem mais simples e
linguagem acessível.

**O que define sucesso:** o usuário entra, entende a tela sem explicação, resolve uma questão
e vê o progresso subir. Se ele precisar ler instruções para saber o que fazer, a interface
falhou.

---

## 2. Escopo

### Dentro da v1

- Linguagem **JavaScript vanilla**, apenas.
- Os 4 níveis de dificuldade: fácil, médio, difícil e nível Deus.
- **100 questões** (25 por nível).
- Correção automática, sistema de pontos, dicas e solução comentada.
- Temas claro e escuro.
- **Conta com e-mail e senha**, com a pontuação guardada no servidor (ver 4.9).
- **Perfil** configurado no cadastro e alterável depois (ver 4.11).
- **Interface em português e inglês** (ver 4.12).

### Fora da v1

- Outras linguagens além de JavaScript. Os botões de **TypeScript, Python, Node.js, C# e Java**
  já existem na tela, em cinza e desabilitados, com as cores de marca prontas para quando as
  questões delas forem escritas (ver 3.8).
- Recuperação de senha por e-mail, login social, confirmação de cadastro.
- Tradução do **conteúdo das questões** — só a interface é bilíngue (ver 4.12).
- Correção das questões no servidor — hoje ela roda no navegador (ver 4.10).
- Publicação na internet: o servidor foi feito para rodar na máquina do usuário.
- Ranking entre usuários, comentários, fórum.

---

## 3. Interface

Esta seção descreve **o que aparece na tela e como se comporta visualmente**. Toda regra de
pontuação, correção e tentativa está na seção 4.

### 3.1 Princípios

- **Enxuta.** Poucas informações por tela, sem frase decorativa ou texto de preenchimento.
  Cada elemento visível precisa ter função.
- **Largura livre.** Sem limite máximo de largura — o conteúdo pode ocupar a tela inteira.
- **Adaptável ao mobile.** Usar toda a largura não pode quebrar em tela pequena; ver 3.7.
- **Hierarquia por tamanho.** Informação secundária (como o selo de dificuldade) usa fonte
  bem menor, para não competir com o enunciado.

### 3.2 Temas

| | Fundo | Cor de destaque |
|---|---|---|
| **Claro** | Branco | Verde claro |
| **Escuro** | Preto | Azul claro |

O alternador de tema fica **no header, à direita, junto da pontuação** (ver 3.3), e está
sempre acessível. A escolha é lembrada entre visitas (ver 4.8).

> **Conflito do dump, resolvido [decisão do PRD]:** a linha 10 do dump pede o botão de tema
> "ao lado esquerdo", mas a linha 11 o coloca no header à direita, junto dos pontos. Vale a
> linha 11, por descrever o header de forma explícita.

### 3.3 Header

Três regiões, da esquerda para a direita:

1. **Logo** — à esquerda.
2. **Nome do site** — centralizado.
3. **Pontuação e tema** — à direita: um `span` com a quantidade de pontos do usuário, e o
   botão de alternar claro/escuro.

A pontuação no header é o indicador permanente de progresso — atualiza assim que um acerto é
computado.

**Em tela pequena**, o header ganha **dois botões a mais**: *Linguagem* e *Nível*, cada um
abrindo uma lista suspensa com as opções. Eles substituem os controles que no desktop ficam
na tela de entrada e no painel lateral — detalhes em 3.7.

### 3.4 Fluxo de entrada

Duas escolhas, em sequência, antes de começar a resolver:

1. **Linguagem** — botões com as linguagens, cada um na cor da própria marca. Na v1 apenas
   **JavaScript** está ativo; as demais aparecem em cinza e não podem ser clicadas (ver 3.8).
2. **Nível** — logo depois, a escolha da dificuldade das questões.

**Padrão de botão (usado nas duas etapas):** pequeno, com **borda arredondada**. É o mesmo
componente nos dois lugares — ver 3.6.

### 3.5 Main

É onde acontece a resolução. De cima para baixo:

**a) Barra de progresso** — atravessa o topo do main. Começa **vermelha** e vai mudando de cor
gradualmente conforme o usuário avança, chegando em **verde**. A transição é contínua, não em
degraus. O que ela mede está em 4.6.

**b) Painel de níveis (lateral direita)** — botões para trocar de nível a qualquer momento,
sem sair da questão atual. Trocar de nível **não zera o avanço** já conquistado.

**c) Campo da pergunta** — o enunciado da questão. Ao lado dele, um `span` com a dificuldade
(fácil / média / difícil / nível Deus): **fonte bem pequena, borda arredondada**. É informação
de apoio, não deve chamar atenção.

**d) Campo de parâmetros** — diz ao usuário **como** responder: o que deve ser produzido e
quais nomes de variáveis usar.

> Exemplo — para uma questão de média:
> *"Considere `n1` como primeira nota, `n2` como segunda nota, `n3` como terceira nota e
> `media` como a média."*

Este campo **dá o norte, nunca a resposta**. Ele define o contrato (nomes e o que retornar);
o caminho até lá é o exercício.

**e) Editor de código** — área de resposta que **simula uma IDE**, no espírito do VS Code:
destaque de sintaxe, numeração de linhas, indentação automática. Implementação em 5.

**f) Campo de resultado** — abaixo do editor, mostra se a resposta está correta ou não após o
envio. Em caso de erro, **o código fica vermelho** — tanto para erro de sintaxe quanto para
resposta incorreta. O resultado **não revela a solução**; o que ele mostra em cada estágio de
tentativa está em 4.4.

> **O vermelho é um aviso, não um estado.** Ele marca *aquela tentativa* como falha e some
> assim que o usuário volta a digitar, devolvendo as cores normais do editor. Só voltará a
> aparecer no próximo envio que falhar. Trocar de questão também limpa a marcação, e a
> escrita feita pelo próprio sistema (carregar o código inicial) não conta como digitação.

**g) Botão de pular** — permite abandonar a questão atual e ir para a próxima.

**h) Estado dos botões** — enquanto a questão está em aberto, *Enviar resposta* e *Pular
questão* ficam disponíveis. Quando a questão **termina** — seja por acerto, seja por esgotar
as tentativas —, os dois são **desabilitados** e o único caminho que sobra é o botão
**Próxima questão**, que aparece no campo de resultado. Digitar depois disso não reabilita
nada; a nova questão reabilita.

### 3.6 Componentes reutilizados

| Componente | Onde aparece |
|---|---|
| **Botão-pílula** (pequeno, borda arredondada) | escolha de linguagem, escolha de nível, painel lateral de níveis |
| **Selo de dificuldade** (fonte mínima, borda arredondada) | ao lado do enunciado |
| **Painel** | enunciado, parâmetros, resultado |

Definir os três uma única vez no CSS e reaproveitar — as três telas do dump usam o mesmo
vocabulário visual.

### 3.7 Responsividade

O dump exige tela cheia **e** adaptação ao mobile; o conflito está no painel lateral de
níveis, que não cabe ao lado do conteúdo em tela estreita. Resolução:

| | Desktop | Mobile |
|---|---|---|
| **Linguagem** | botões na tela de entrada | botão **Linguagem** no header, abre lista suspensa |
| **Nível** | painel lateral fixo à direita | botão **Nível** no header, abre lista suspensa |

**Comportamento das listas suspensas:**

- Abrem ancoradas ao botão que as chamou, sobre o conteúdo.
- Marcam visualmente a opção ativa no momento.
- Escolher uma opção aplica a mudança e fecha a lista.
- Fecham também ao tocar fora ou ao pressionar `Esc`.
- Abrir uma fecha a outra — nunca as duas ao mesmo tempo.
- Trocar de nível por aqui segue a regra 4.6: **não zera o avanço**.

**Demais ajustes em tela pequena:**

- O nome do site encolhe ou dá lugar aos dois botões, para o header não quebrar em duas
  linhas apertadas. Logo, pontos e alternador de tema permanecem visíveis.
- O editor mantém altura mínima confortável para digitar no celular.
- Nada provoca rolagem horizontal da página — o editor rola dentro da própria área.

### 3.8 Cores das linguagens

Cada linguagem tem a cor da própria marca, definida em `LINGUAGENS` (`assets/js/questions.js`)
junto com a cor de texto que garante contraste sobre ela:

| Linguagem | Cor | Estado na v1 |
|---|---|---|
| JavaScript | `#f7df1e` amarelo | **ativa** |
| TypeScript | `#3178c6` azul | cinza |
| Python | `#4b8bbe` azul | cinza |
| Node.js | `#5fa04e` verde | cinza |
| C# | `#68217a` roxo | cinza |
| Java | `#ed8b00` laranja | cinza |

**Regra:** a cor da marca só aparece quando `ativa` é `true`. Enquanto a linguagem não tem
questões, o botão fica cinza, desabilitado e com um `title` explicando o porquê — a cor já
está registrada, apenas não é aplicada ainda. Nos menus de tela pequena a linguagem aparece
com um ponto colorido, que fica em escala de cinza quando indisponível.

**Para ativar uma linguagem:** trocar `ativa` para `true` e adicionar as questões dela em
`assets/js/questions/`. Nenhuma outra mudança é necessária.

---

## 4. Regras do sistema

### 4.1 Modelo da questão

Cada questão carrega:

| Campo | Descrição |
|---|---|
| `id` | Identificador estável, usado para gravar progresso |
| `nivel` | `facil` · `medio` · `dificil` · `deus` |
| `enunciado` | O problema, em linguagem acessível |
| `parametros` | Nomes de variáveis e o que deve ser produzido (campo 3.5d) |
| `assinatura` | Nome da função que o corretor vai chamar |
| `testes` | Lista de casos `entrada → saída esperada` |
| `dica` | Liberada após 5 falhas — orienta, não resolve |
| `solucao` | Código correto **comentado linha a linha**, liberado após 10 falhas |

### 4.2 Níveis e pontuação

| Nível | Pontos | Conteúdo típico |
|---|---|---|
| Fácil | **3** | Somar dois números, calcular média, verificar par ou ímpar |
| Médio | **5** **[decisão do PRD]** | Condicionais, laços, manipulação de string e array |
| Difícil | **7** **[decisão do PRD]** | Métodos de iteração, funções de ordem superior, recursão |
| Nível Deus | **10** | POO, consumo de API, assincronismo |

Fácil = 3 e Deus = 10 vêm do dump; os intermediários foram interpolados para manter a
progressão.

**Cada questão pontua uma única vez [decisão do PRD]** — no primeiro acerto. Refazer uma
questão já resolvida não gera pontos novos.

### 4.3 Correção

A correção acontece **no servidor**, não no navegador. O navegador envia o código; o
servidor roda os testes e devolve o veredito.

- A resposta roda em um **processo separado com limite de 2 segundos**. Um laço infinito
  mata só esse processo — o servidor continua no ar e reporta "seu código demorou demais".
- O processo sobe com o **modelo de permissões do Node** (`--permission`): sem sistema de
  arquivos, sem subprocessos, sem `process.binding`. O código do usuário roda em
  `new Function`, onde `require` não existe, e o `fetch` é o mock da questão.
- A correção executa os `testes` da questão contra a função de `assinatura`. **Todos** os
  casos precisam passar para a resposta ser considerada correta.
- **Erro de sintaxe** é tratado como uma falha comum: o código fica vermelho e a mensagem do
  interpretador é exibida. Conta no mesmo contador de tentativas.
- **Falha de comunicação não conta como tentativa** — servidor fora do ar não é erro do
  usuário, e gastar uma das dez chances dele por isso seria injusto.

### 4.4 Ciclo de tentativas

O dump descreve dois estágios de 5 tentativas. Formalizando:

| Tentativas | O que acontece ao errar |
|---|---|
| 1 – 4 | Código fica vermelho, informa que está incorreto. Sem dica. |
| **5ª falha** | Libera a **dica** — orienta o raciocínio, **não entrega a resposta**. |
| 6 – 9 | Continua sinalizando erro, com a dica visível. |
| **10ª falha** | Mostra a **forma correta do código, explicada linha por linha**. |

**A solução nunca aparece antes da 10ª falha.** Essa é a regra central do produto: o valor
está na tentativa, não na resposta pronta.

O contador é **por questão** e vive **no servidor**, não no navegador. Recarregar a página
não devolve as tentativas — antes devolvia. Ele fica em memória, então reiniciar o servidor
zera os contadores; a consequência é apenas a dica demorar um pouco mais a aparecer.

Dica e solução **não são enviadas ao navegador antes da hora**: elas só aparecem na resposta
da API quando o servidor decide liberá-las. Forjar o contador no navegador não adianta.

**Ao esgotar as tentativas** (10ª falha), a questão se encerra: *Enviar resposta* e *Pular
questão* são desabilitados e só resta seguir para a próxima. Não faz sentido continuar
enviando depois que a resposta foi mostrada, nem pular uma questão que já terminou.

### 4.5 Acerto

Ao acertar, exibir uma mensagem **parabenizando** o usuário e informando explicitamente que
**seu avanço foi computado**. Em seguida, pontos e barra de progresso são atualizados.

### 4.6 Progresso e pontuação

- A **pontuação do header** é global: soma de todos os pontos ganhos, em todos os níveis.
- A **barra de progresso** mede o percentual de questões **acertadas dentro do nível
  atualmente selecionado** **[decisão do PRD]**.
- Cada nível guarda o próprio progresso de forma independente. É isso que cumpre a exigência
  do dump de que **trocar de nível não zere o avanço**: ao voltar para um nível, a barra volta
  exatamente onde estava.

### 4.7 Pular questão **[decisão do PRD]**

- Não concede pontos e **não aplica penalidade**.
- A questão volta ao fim da fila daquele nível e pode ser reencontrada depois.
- O contador de tentativas dela é zerado.

### 4.8 Persistência **[decisão do PRD]**

Gravado em `localStorage`, sem backend:

- pontuação total;
- questões já resolvidas (por `id`), que alimentam o progresso de cada nível;
- tema escolhido (claro/escuro).

Consequência a assumir: o progresso é local ao navegador e some se o usuário limpar os dados
do site.

### 4.9 Questões com API (nível Deus)

- O enunciado traz o **link da API pública** para o usuário se basear ao escrever a requisição.
- Usar apenas APIs públicas e de uso livre.
- Na correção, o `fetch` é **substituído por um mock com resposta fixa**. O usuário escreve
  código de requisição real, e o teste continua passando **offline**, se a API sair do ar ou
  mudar o formato de resposta.
- Um mock pode declarar `ok: false` para **simular uma resposta de erro** (404, por exemplo).
  É o que permite cobrar tratamento de falha do usuário, como na questão do `resposta.ok`.
- Uma URL que o exercício não conhece faz o `fetch` **rejeitar**, o que exercita `try/catch`.

### 4.9 Conta e pontuação no servidor

**Cadastro:** e-mail e senha, só isso. Senha com no mínimo 8 caracteres.

**O que a conta guarda:** pontuação, questões resolvidas e tema.

**Como o progresso se comporta:**

| Situação | O que acontece |
|---|---|
| Sem servidor (duplo clique) | tudo funciona; progresso só no navegador, sem conta |
| Com servidor, deslogado | igual ao anterior, mais um link *Entrar* no header |
| Ao entrar | o progresso local e o da conta são **mesclados**, não substituídos |
| Durante o uso | cada acerto grava no navegador e sobe para a conta |
| Ao sair | token e progresso local são apagados; a conta no servidor fica intacta |

**Regra da mesclagem [decisão do PRD]:** a lista de questões resolvidas é a união das duas,
e os pontos são **recalculados** a partir dela. Isso evita dois problemas: perder o que foi
feito deslogado, e somar pontos em dobro ao juntar as duas origens.

**Sair apaga o progresso local** para que a próxima pessoa a usar o computador não herde a
pontuação de quem saiu. Os dados continuam na conta e voltam no próximo login.

### 4.10 Pontuação confiável

A pontuação de uma conta **só muda como consequência de um acerto verificado pelo servidor**.
Três decisões sustentam isso:

1. **Não existe rota para gravar progresso.** Era por ela que dava para enviar qualquer
   número; foi removida.
2. **Os pontos são recalculados** a partir da lista de questões resolvidas, no servidor. O
   navegador nunca envia um valor de pontuação.
3. **Os casos de teste não saem do servidor.** O catálogo entregue ao navegador tem só
   `id`, `nivel`, `titulo`, `enunciado`, `parametros`, `assinatura` e `modelo` — sem
   `testes`, `dica`, `solucao` ou `explicacao`. Antes bastava abrir o DevTools para ler o
   gabarito antes de tentar.

**Preço pago [decisão do PRD]:** o site deixou de funcionar com duplo clique no
`index.html`. Sem servidor não há correção, e abrir o arquivo direto mostra uma tela
explicando como subir o servidor. Não havia como manter as duas coisas: correção no
navegador é, por construção, correção que o usuário controla.

**Progresso de visitante não migra para a conta.** Aceitar a lista de resolvidas que o
navegador afirma ter reabriria a mesma porta. Ao entrar, o servidor substitui o estado
local e a tela avisa que o que foi feito sem conta não pontua.

### 4.11 Perfil

Preenchido no momento do cadastro e alterável depois pelo botão **⚙** no header.

| Campo | Regra |
|---|---|
| Nome completo | 2 a 80 caracteres |
| Nome de usuário | 3 a 20 caracteres (`a-z`, `0-9`, `.`, `-`, `_`), **único** |
| Linguagem que quer treinar | qualquer uma da lista, inclusive as ainda sem questões |
| Idioma do site | `pt` ou `en` |
| Ano de nascimento | 1900 até o ano atual |
| Sexo | `homem` ou `mulher` |

**No header** aparecem, ao lado do alternador de tema: avatar (SVG conforme o sexo),
nome de usuário e o botão de configurações.

**Validação em dois lugares [decisão do PRD]:** o formulário confere as mesmas regras
para dar retorno imediato, mas quem decide é `servidor/perfil.js`. Os erros voltam como
**código** (`username_em_uso`, `ano_invalido`…) e não como frase pronta — a interface
existe em dois idiomas e é ela quem escolhe a mensagem.

**Contas anteriores ao perfil [decisão do PRD]:** `GET /api/perfil` devolve `null`, e a
tela abre a janela de configurações sem botão de cancelar, sem fechar por `Esc` nem por
clique fora. É migração conduzida pela interface, sem script de banco.

### 4.12 Idioma da interface

Português e inglês, trocáveis a qualquer momento. A escolha vive no perfil (quando há
conta) e no `localStorage` (sempre), então vale também para quem usa sem conta.

O texto estático do HTML é marcado com `data-i18n` e traduzido de uma vez; o que é
montado por JavaScript é redesenhado na troca. O nome dos níveis vem do servidor nos dois
idiomas.

> **Limite explícito:** o **conteúdo das questões** não é traduzido. Enunciado, parâmetros,
> dica e explicação continuam em português, mesmo com a interface em inglês. Traduzir 100
> questões é trabalho de outra ordem; o formato suporta (cada campo viraria `{pt, en}`,
> como já acontece com o nome dos níveis), mas não foi feito.

---

## 5. Decisões técnicas

| Decisão | Motivo |
|---|---|
| **CodeMirror 6** para o editor | Entrega destaque de sintaxe, numeração de linhas e marcação de erro prontos. Recriar isso à mão daria um editor bem mais pobre que a "IDE" pedida no dump. |
| **CodeMirror empacotado em `assets/vendor/`**, e não puxado de um CDN | Importar os três pacotes do esm.sh virava 53 pedidos a um servidor de terceiros, e `Promise.all` rejeita no primeiro erro: bastava um falhar para o editor virar textarea — o que, na hospedagem, acontecia na maioria dos carregamentos. Empacotado, é um pedido só, para o mesmo servidor que já entrega o site. |
| **Resumo do conteúdo no nome do bundle** (`codemirror.<resumo>.min.js`) | É o que autoriza guardá-lo no navegador por um ano: conteúdo diferente gera nome diferente, então o cache nunca serve uma versão velha. Um número de versão à mão não valeria — o bundle junta três pacotes, e bastaria esquecer de trocá-lo uma vez. |
| **`ETag` e `304` nos arquivos estáticos** | O resto tem nome fixo e precisa ser conferido a cada visita. Com a etiqueta saindo do conteúdo (e não da data, que todo deploy reescreve), conferir custa uma resposta vazia em vez do arquivo inteiro. |
| **Web Worker** para executar a resposta | Isola o código do usuário e permite timeout contra laço infinito. |
| **Sem etapa de build para rodar** | `index.html` abre direto no navegador. O bundle do editor é gerado uma vez (`npm run build:editor`) e versionado, então nem quem clona nem a hospedagem precisam construir nada. |
| **`addEventListener`**, sem evento inline no HTML | Padrão já adotado nos seus projetos anteriores. |
| **Servidor em Node puro**, sem dependências | Usa só `http`, `crypto` e `fs`. Dispensa `npm install`, que é onde projetos de estudo costumam travar no Windows. |
| **`crypto.scrypt`** para a senha | Função de derivação feita para senha: lenta de propósito e com sal por usuário. |
| **Token assinado com HMAC-SHA256** | Sem sessão em memória: o servidor valida pela assinatura e reiniciar não desloga ninguém. |
| **Postgres na hospedagem, arquivo JSON na máquina local** | O disco do contêiner volta ao estado do build a cada reinício, e o plano gratuito reinicia sempre: conta guardada em arquivo lá dura uma sessão. Os dois destinos vivem atrás da mesma API em `banco.js`, que era justamente o ponto de isolá-lo. Na própria máquina o arquivo continua valendo — não há nada a configurar. |
| **Postgres pela API REST, com `fetch`** | Um driver de banco seria a primeira dependência de execução do projeto. Falando HTTP, o servidor continua rodando só com o que vem no Node. |
| **Lista de permissão** nos arquivos servidos | Só `index.html`, `login.html` e `assets/` saem pela rede; `servidor/dados/` fica inalcançável por padrão. |
| **Sandbox em processo separado** com `--permission` | Executar código de terceiros é a parte perigosa do projeto. Processo separado dá o limite de tempo; o modelo de permissões fecha arquivos, subprocessos e `process.binding`. |
| **Fila de 4 correções simultâneas** | Sem ela, muitos envios ao mesmo tempo abririam processos sem limite. |
| **Favicon em SVG** | Um arquivo só, nítido em qualquer tamanho, sem precisar gerar PNGs. |
| **Campos do perfil definidos uma vez** (`assets/js/perfil.js`) | Cadastro e configurações mostram os mesmos campos; escrevê-los duas vezes garantiria que um dia divergiriam. |
| **Erros da API como código**, não como frase | A interface é bilíngue: quem escolhe o idioma da mensagem é a tela, não o servidor. |
| **Avatares em SVG com figura branca sobre círculo neutro** | Mesma cor para os dois, para a distinção vir da forma e não de cor estereotipada. |

CodeMirror é a **única** dependência externa do projeto, e mesmo ela não é
instalada para rodar: o que o navegador recebe é o bundle de `assets/vendor/`
já pronto. As dependências em `package.json` são todas de desenvolvimento, usadas
só para regerar esse arquivo.

---

## 6. Estrutura de arquivos

Exigência do dump: só o `index.html` fica fora de `assets/`.

```
solving_questions/
├── index.html              único arquivo fora de assets/ (com login.html)
├── login.html
├── assets/
│   ├── styles.css
│   ├── images/favicon.svg
│   ├── vendor/
│   │   ├── entrada.js         fonte do bundle (não vai ao navegador)
│   │   ├── build.js           gera o bundle e acerta o nome no index.html
│   │   └── codemirror.<resumo>.min.js   gerado por npm run build:editor
│   └── js/
│       ├── catalogo.js     busca as questões no servidor
│       ├── corrector.js    envia a resposta para correção
│       ├── script.js       liga a interface às regras
│       ├── editor.js       CodeMirror com reserva em textarea
│       ├── storage.js      progresso no navegador
│       ├── auth.js         cliente da API de contas
│       └── login.js        tela de login
├── servidor/
│   ├── servidor.js         HTTP: arquivos + API
│   ├── questoes.js         catálogo e cálculo de pontos
│   ├── questoes/           facil · medio · dificil · deus (25 cada)
│   ├── executor.js         processo isolado + limite de tempo
│   ├── sandbox.js          onde o código do usuário roda
│   ├── auth.js             scrypt e HMAC
│   ├── banco.js            usuários
│   └── dados/              criado ao rodar — no .gitignore, e só usado
│                           quando não há Postgres configurado
└── docs/
    ├── dump.md             ideia original (não editar)
    └── PRD.md              este documento
```

O dump exige apenas que tudo que não seja o `index.html` fique dentro de `assets/`. Os
arquivos JavaScript ficam agrupados em `assets/js/`, e o banco de questões é dividido por
nível para continuar navegável com 100 questões.

**Ordem de carregamento:** os quatro arquivos de nível vêm antes de `questions.js`, que os
concatena em `QUESTOES`.

---

## 7. Banco de questões da v1

**100 questões, 25 por nível.** Cada uma traz enunciado, parâmetros, código inicial, casos de
teste, dica e solução comentada linha a linha.

### Critérios de classificação

- **Fácil** — operação única e direta. *Somar dois números, calcular média, verificar se um
  número é par ou ímpar.*
- **Médio** — combina condicional e repetição; manipulação de string e array.
- **Difícil** — métodos de iteração (`map`, `filter`, `reduce`), funções próprias, funções de
  ordem superior, recursão.
- **Nível Deus** — POO, assincronismo, consumo de API pública.

No conjunto, as questões devem cobrir JavaScript de forma ampla: métodos nativos, funções
próprias, métodos de iteração, objetos e classes.

### Diretrizes de redação

1. **Linguagem acessível.** Evitar termo técnico; quando for inevitável, explicar ali mesmo,
   de forma simples.
2. **O enunciado dá o norte, não a resposta.** Informa nomes de variáveis e o que deve ser
   produzido, sem descrever a implementação.
3. **Enunciado curto.** Um problema por questão.
4. **Cada questão precisa de casos de teste** que cubram também os limites (zero, número
   negativo, lista vazia) — senão a correção aceita solução incompleta.

---

## 8. Suposições em aberto

Preenchi estas lacunas para o documento ficar executável. Todas são reversíveis:

| # | Suposição | Alternativa |
|---|---|---|
| 1 | Médio = 5 e difícil = 7 pontos | Outra curva de pontuação |
| 2 | Barra de progresso = % de acertos no nível atual | Medir sobre o total das 100 questões |
| 3 | Pular não penaliza e devolve a questão à fila | Penalizar, ou remover a questão de vez |
| 4 | Questão pontua uma única vez | Pontuar toda vez que for resolvida |
| 5 | Progresso em `localStorage` | Exportar/importar arquivo de progresso |
| 6 | Timeout de execução de 2s | Outro limite |
| 7 | No mobile, linguagem e nível viram dois botões com lista suspensa no header | Menu lateral recolhível |
| 8 | Botão de tema no header à direita (conflito das linhas 10 e 11 do dump) | Movê-lo para a esquerda |
