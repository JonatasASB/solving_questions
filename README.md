# Resolução de Questões

Site para treinar lógica de programação resolvendo questões de JavaScript no navegador.
100 questões em quatro níveis, correção automática, dicas e sistema de pontos.

## Como rodar

```
node servidor/servidor.js
```

E abra <http://localhost:3000>. Não precisa de `npm install`: o servidor usa apenas
módulos que já vêm no Node.

> **O duplo clique no `index.html` não funciona mais.** A correção das questões passou a
> acontecer no servidor, então ele precisa estar rodando. Abrir o arquivo direto mostra
> uma tela explicando isso. Foi uma troca consciente: é o que torna a pontuação confiável
> e mantém o gabarito fora do alcance de quem abre o DevTools.

Dá para usar **sem conta** — a pontuação fica só naquele navegador — ou **criar uma conta**
com e-mail e senha, e aí ela fica guardada no servidor.

## Estrutura

```
solving_questions/
├── index.html              tela das questões
├── login.html              entrar / criar conta
├── assets/
│   ├── styles.css
│   ├── images/
│   │   ├── favicon.svg
│   │   ├── avatar-homem.svg
│   │   └── avatar-mulher.svg
│   └── js/
│       ├── catalogo.js     busca as questões no servidor
│       ├── corrector.js    envia a resposta para correção
│       ├── script.js       liga a interface às regras
│       ├── editor.js       CodeMirror, com reserva em textarea
│       ├── storage.js      progresso no navegador
│       ├── idioma.js       textos em português e inglês
│       ├── perfil.js       campos do perfil (cadastro e configurações)
│       ├── auth.js         cliente da API de contas
│       └── login.js        tela de login
├── servidor/
│   ├── servidor.js         HTTP: arquivos + API
│   ├── questoes.js         catálogo e cálculo de pontos
│   ├── questoes/           facil · medio · dificil · deus (25 cada)
│   ├── executor.js         abre o processo isolado e aplica o limite de tempo
│   ├── sandbox.js          onde o código do usuário roda
│   ├── auth.js             senha (scrypt) e token (HMAC)
│   ├── perfil.js           validação dos dados do perfil
│   ├── banco.js            leitura e escrita dos usuários
│   └── dados/              criado na primeira execução — NÃO versionar
└── docs/
    ├── dump.md             ideia original
    └── PRD.md              requisitos
```

## API

| Rota | O que faz |
|---|---|
| `GET /api/questoes` | catálogo das questões — **sem** testes, dica ou solução |
| `POST /api/corrigir` | roda a resposta, decide o acerto e libera dica/solução na hora certa |
| `POST /api/cadastrar` | cria conta com e-mail e senha, devolve token |
| `POST /api/entrar` | autentica e devolve token |
| `GET /api/progresso` | lê o progresso da conta |
| `GET /api/perfil` | lê o perfil da conta |
| `PUT /api/perfil` | altera o perfil |

Repare no que **não** existe: uma rota para gravar pontuação. Ela era a porta pela qual
dava para enviar qualquer número. Hoje o progresso da conta só muda como consequência de
uma resposta correta verificada em `/api/corrigir`.

## Conta e perfil

Ao criar a conta, além de e-mail e senha, o usuário configura:

| Campo | Observações |
|---|---|
| Nome completo | de 2 a 80 caracteres |
| Nome de usuário | 3 a 20 caracteres, único, é o que aparece no topo da tela |
| Linguagem que quer treinar | qualquer uma da lista; as sem questões vêm marcadas "(em breve)" |
| Idioma do site | português ou inglês |
| Ano de nascimento | de 1900 até o ano atual |
| Sexo | homem ou mulher — define o avatar do header |

O botão **⚙** no header abre as configurações, com exatamente os mesmos campos.
A definição deles vive em `assets/js/perfil.js` e é usada nas duas telas, para não
divergirem.

**Contas criadas antes do perfil existir** continuam funcionando: ao entrar, a janela de
configurações abre sozinha, explica o motivo e não deixa sair sem preencher.

## Idioma

A **interface** existe em português e inglês, e troca na hora — pelo seletor da tela de
login ou pelo campo "Idioma do site" nas configurações.

> **O conteúdo das 100 questões continua só em português.** Enunciado, parâmetros, dica e
> explicação não foram traduzidos: é um trabalho de outra ordem de grandeza, e preferi
> entregar a interface completa a entregar as duas coisas pela metade. O formato das
> questões suporta a tradução — cada campo de texto viraria `{ pt, en }`, como já é o
> caso do nome dos níveis em `servidor/questoes.js`.

## Como o código do usuário roda com segurança

Executar código de terceiros é a parte perigosa deste projeto. As camadas, da mais forte
para a mais fraca:

1. **Processo separado** — cada correção abre um processo próprio, que o servidor mata se
   passar de 2 segundos. Um laço infinito derruba só o filho.
2. **Modelo de permissões do Node** (`--permission`) — o processo não lê arquivos, não
   abre subprocessos e não alcança `process.binding`, que é o caminho clássico de fuga.
3. **`new Function`** — `require` não existe nesse escopo, então não há como carregar
   módulos.
4. **`fetch` substituído** pelo mock da questão, o que fecha a saída de rede.

Ao subir, o servidor confere se o `--permission` funcionou e avisa no terminal se não.

Testado contra: leitura de arquivo, `require`, cadeia de `constructor`, `process.exit` e
requisição de rede — todos bloqueados, e o servidor continua de pé depois.

## Sobre as senhas

Senha nunca é guardada. O que vai para o disco é o resultado do `scrypt` com um sal
aleatório por usuário. A comparação usa `timingSafeEqual`, e o login responde a mesma
mensagem para e-mail inexistente e senha errada, para não revelar quais e-mails têm conta.

`servidor/dados/` guarda os hashes e o segredo que assina os tokens. Já está no
`.gitignore` — **não versione essa pasta**.

## O que ainda falta para colocar na internet

- HTTPS.
- Um banco de dados no lugar do arquivo JSON.
- Limite de requisições em `/api/corrigir` (hoje há só a fila de 4 correções simultâneas).
- Rodar o sandbox em contêiner, não só em processo separado.
