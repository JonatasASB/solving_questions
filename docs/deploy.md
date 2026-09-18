# Colocar o site no ar (Render, plano gratuito)

## Por que não dá para usar GitHub Pages, Vercel ou Netlify

A correção das questões abre um **subprocesso Node** com o modelo de permissões
(`servidor/executor.js`). Isso exige um contêiner de verdade:

- **Hospedagem estática** (GitHub Pages) não roda servidor nenhum — não haveria API.
- **Serverless** (Vercel/Netlify Functions) não deixa abrir subprocesso — a correção
  quebraria, mesmo com o resto funcionando.

O Render roda um contêiner comum, então funciona sem adaptação.

---

## Passo a passo

### 1. Gere o segredo dos tokens

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Guarde o resultado — ele vai no passo 4. (Se usar o Blueprint do `render.yaml`,
o Render gera sozinho e você pode pular este passo.)

### 2. Crie a conta

Em <https://render.com>, entre com a conta do GitHub. Autorize o acesso ao
repositório `solving_questions`.

### 3. Crie o serviço

**New +** → **Web Service** → escolha o repositório `solving_questions`.

| Campo | Valor |
|---|---|
| Language / Runtime | `Node` |
| Branch | `main` |
| Build Command | `npm install --omit=dev` |
| Start Command | `npm start` |
| Instance Type | `Free` |

> Os nomes dos campos mudam de tempos em tempos. O que importa é: runtime Node,
> branch `main`, start `npm start`, plano gratuito.

O `--omit=dev` não é obrigatório — só evita instalar no servidor o esbuild e o
CodeMirror, que servem para gerar `assets/vendor/codemirror.min.js` e não fazem
falta em produção, já que esse arquivo é versionado pronto. Sem o `--omit=dev`
o deploy funciona igual, só demora um pouco mais.

### 4. Configure as variáveis de ambiente

Em **Environment**, adicione:

| Chave | Valor |
|---|---|
| `SEGREDO_TOKEN` | o segredo gerado no passo 1 |
| `SUPABASE_URL` | endereço do banco — "Onde as contas ficam guardadas", abaixo |
| `SUPABASE_CHAVE` | chave `service_role` do banco, na mesma seção |

Dá para subir sem as duas do Supabase: o site funciona, mas as contas criadas
somem no primeiro reinício.

**Não configure `PORT`.** O Render injeta essa variável sozinho, e o servidor já
a lê (`servidor/servidor.js`). Definir na mão quebra o deploy.

### 5. Suba

**Create Web Service**. O primeiro deploy leva alguns minutos. O endereço final é
`https://solving-questions.onrender.com` (ou o nome que você escolheu).

A cada `git push` para a `main`, o Render refaz o deploy sozinho.

---

## Onde as contas ficam guardadas

O servidor escolhe o destino pelo ambiente, em `servidor/banco.js`:

| `SUPABASE_URL` e `SUPABASE_CHAVE` | Destino |
|---|---|
| definidos | Postgres, pela API REST |
| ausentes | `servidor/dados/usuarios.json`, no disco |

Na sua máquina não configure nada: o arquivo local é o caminho certo ali, e ele
é criado sozinho. Na hospedagem, sem as duas variáveis as contas somem a cada
reinício — e o servidor avisa isso no log da subida.

### 1. Crie o banco

Em <https://supabase.com>, crie um projeto. Qualquer Postgres gerenciado com API
REST serve; o passo a passo abaixo usa o Supabase porque o plano gratuito dele
não pede cartão.

### 2. Crie a tabela

No **SQL Editor** do projeto, rode:

```sql
create table usuarios (
  id        text primary key,
  email     text unique not null,
  senha     text not null,
  criado_em timestamptz not null default now(),
  perfil    jsonb,
  progresso jsonb not null default '{"pontos":0,"resolvidas":[],"tema":"claro"}'::jsonb
);

-- buscarPorUsername procura dentro do jsonb; sem o índice isso varre a tabela
create index usuarios_username on usuarios ((perfil->>'username'));

-- Fecha a tabela para as chaves públicas. O servidor usa a chave de serviço,
-- que ignora RLS; o navegador nunca fala com o banco. Sem esta linha, qualquer
-- pessoa com a chave anon (que é pública por definição) leria os hashes de
-- senha de todo mundo.
alter table usuarios enable row level security;
```

### 3. Pegue as duas variáveis

Em **Project Settings → API**:

| Variável do Render | Onde achar no Supabase |
|---|---|
| `SUPABASE_URL` | *Project URL* — algo como `https://abcdefgh.supabase.co` |
| `SUPABASE_CHAVE` | *Project API keys* → **`service_role`** |

> A `service_role` dá acesso total à tabela, ignorando RLS. Ela vive **só** no
> ambiente do servidor: não vá para o `.env` commitado, não vá para o navegador,
> não vá para o README. Se vazar, gere outra no painel do Supabase.
>
> A chave `anon` não serve aqui: com o RLS ligado e nenhuma policy, ela não
> enxerga a tabela — que é exatamente o ponto.

### 4. Configure no Render

Em **Environment**, adicione as duas. O serviço reinicia sozinho, e o log da
subida deve mostrar:

```
Contas no Postgres: https://abcdefgh.supabase.co
```

Se aparecer `ERRO: o banco configurado não respondeu`, a URL ou a chave estão
erradas — a mensagem traz a resposta do banco. Se aparecer `Contas em arquivo
local`, as variáveis não chegaram ao processo.

---

## O que esperar do plano gratuito

**O serviço dorme depois de ~15 minutos sem acesso.** A visita seguinte espera
quase um minuto para a primeira resposta. Se o link vai num currículo, vale abrir
o site alguns minutos antes de uma entrevista para ele já estar acordado.

**O disco é apagado a cada reinício**, não só a cada deploy — e como o serviço
dorme sozinho, reinício ali é rotina. Qualquer coisa que o servidor escreva no
disco do contêiner dura, na prática, uma sessão de uso.

É por isso que as contas vão para um Postgres externo (a seção abaixo), e não
para `servidor/dados/usuarios.json`. Sem o banco configurado, cada visita
encontra o cadastro vazio e é preciso criar conta de novo.

O `SEGREDO_TOKEN` é a outra peça que precisa sobreviver — por vir do ambiente,
ele não é perdido. Sem isso, cada reinício deslogaria todo mundo mesmo com as
contas guardadas.

---

## Sobre o serviço dormir

Isso o banco não resolve: as contas passam a sobreviver, mas a primeira visita
depois de um tempo parado continua esperando o contêiner acordar.

O **Fly.io** não dorme, ao custo de uma configuração mais trabalhosa (CLI
própria, `fly.toml`, cartão cadastrado). Só vale a pena se o site deixar de ser
portfólio e passar a ter usuários de verdade.

> Condições de plano gratuito mudam com frequência em qualquer um desses serviços.
> Confirme os termos atuais antes de decidir.
