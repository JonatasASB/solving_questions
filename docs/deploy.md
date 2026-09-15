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
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | `Free` |

> Os nomes dos campos mudam de tempos em tempos. O que importa é: runtime Node,
> branch `main`, start `npm start`, plano gratuito.

### 4. Configure a variável de ambiente

Em **Environment**, adicione:

| Chave | Valor |
|---|---|
| `SEGREDO_TOKEN` | o segredo gerado no passo 1 |

**Não configure `PORT`.** O Render injeta essa variável sozinho, e o servidor já
a lê (`servidor/servidor.js`). Definir na mão quebra o deploy.

### 5. Suba

**Create Web Service**. O primeiro deploy leva alguns minutos. O endereço final é
`https://solving-questions.onrender.com` (ou o nome que você escolheu).

A cada `git push` para a `main`, o Render refaz o deploy sozinho.

---

## O que esperar do plano gratuito

**O serviço dorme depois de ~15 minutos sem acesso.** A visita seguinte espera
quase um minuto para a primeira resposta. Se o link vai num currículo, vale abrir
o site alguns minutos antes de uma entrevista para ele já estar acordado.

**O disco é apagado a cada deploy.** `servidor/dados/usuarios.json` some junto, ou
seja, **as contas criadas não sobrevivem**. Quem visitar depois disso começa do
zero. Para portfólio isso é pouco grave: o site inteiro funciona sem conta, e é
assim que um recrutador vai usá-lo.

O `SEGREDO_TOKEN` é a exceção — por vir do ambiente, ele **não** é perdido no
deploy. Sem isso, cada atualização deslogaria todo mundo.

---

## Se quiser evitar as duas limitações

O **Fly.io** não dorme e oferece disco persistente, ao custo de uma configuração
mais trabalhosa (CLI própria, `fly.toml`, cartão cadastrado). Só vale a pena se o
site deixar de ser portfólio e passar a ter usuários de verdade — aí o próximo
passo natural é trocar o arquivo JSON por um banco de dados.

> Condições de plano gratuito mudam com frequência em qualquer um desses serviços.
> Confirme os termos atuais antes de decidir.
