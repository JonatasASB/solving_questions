# Resolução de Questões

Site para treinar lógica de programação resolvendo questões de JavaScript no navegador.

---

## Funcionalidades

### Questões e correção

| | |
|---|---|
| **100 questões** | divididas em quatro níveis: Fácil, Médio, Difícil e Nível Deus |
| **Editor de código** | CodeMirror com destaque de sintaxe, servido junto com o site, e `textarea` como reserva se ele não carregar |
| **Correção automática** | a resposta roda de verdade contra os testes da questão e devolve acerto ou erro |
| **Sem entregar a resposta** | o erro nunca mostra o gabarito — o catálogo enviado ao navegador não contém testes, dica nem solução |
| **Limite de 2 segundos** | laço infinito é interrompido com aviso, em vez de travar a página |
| **Pular questão** | não pontua, não penaliza e devolve a questão ao fim da fila |

### Ajuda progressiva

A ajuda aparece conforme o usuário tenta, nunca antes:

- **5 erros** na mesma questão → libera a **dica**
- **10 erros** → libera a **solução comentada**

### Pontuação e progresso

- Cada nível vale pontos diferentes: **Fácil 3 · Médio 5 · Difícil 7 · Deus 10**
- **Barra de progresso** que mede os acertos dentro do nível atual e muda de cor conforme avança — vermelho no começo, verde no fim
- Cada nível guarda o próprio progresso, então **trocar de nível não zera nada**
- Contador de pontos no header

### Contas

- **Modo visitante** — dá para resolver tudo sem criar conta; a pontuação fica só naquele navegador
- **Conta com e-mail e senha** — o progresso fica guardado no servidor e acompanha o usuário entre navegadores
- **Perfil** com nome completo, nome de usuário, linguagem que quer treinar, idioma do site, ano de nascimento e sexo
- Botão **⚙** no header abre as configurações com os mesmos campos do cadastro

### Aparência e idioma

- **Tema claro e escuro**, alternado pelo botão ☾ / ☀ no header — o editor de código acompanha a troca
- **Interface em português e inglês**, com troca imediata pelo seletor do login ou pelas configurações
- **Avatar** no header conforme o sexo escolhido no perfil
- Layout adaptado para celular

> O **conteúdo das questões** continua só em português. Enunciado, parâmetros, dica e explicação não foram traduzidos — o formato suporta a tradução, cada campo de texto viraria `{ pt, en }`, como já acontece com o nome dos níveis.

---

## Dicas de UI/UX

### Use os tokens, não valores soltos

O CSS define tudo em variáveis no `:root` de `assets/styles.css`. Ao criar um componente novo, puxe de lá em vez de escrever o valor na mão — é o que mantém o site coerente e faz o tema escuro funcionar de graça.

```css
--raio: 10px;          /* cantos de caixas e botões   */
--raio-pilula: 999px;  /* botões de nível e etiquetas */
--transicao: 160ms ease;
--fonte / --fonte-codigo
```

As cores (`--fundo`, `--superficie`, `--texto`, `--destaque`, `--erro`…) são **redefinidas** em `html[data-tema="escuro"]`. Toda cor nova precisa das duas versões, senão o componente quebra em um dos temas.

### Escreva o tema escuro junto, não depois

O tema é trocado por um atributo em `<html>`, então basta acrescentar a cor nos dois blocos ao mesmo tempo. Deixar para "ajustar o dark mode depois" é o que gera texto ilegível sobre fundo preto.

### Respeite os dois pontos de quebra

O layout já quebra em **820px** (celular e tablet) e **400px** (telas estreitas). Use esses mesmos valores em vez de inventar um terceiro — três pontos de quebra desalinhados fazem o layout pular em larguras intermediárias.

### Mantenha a acessibilidade que já existe

A interface atualiza `aria-valuenow` na barra de progresso, `aria-expanded` nos menus e `aria-selected` nos níveis. Componente novo com o mesmo papel precisa do mesmo atributo — é barato fazer junto e caro voltar depois.

### Poucas informações na tela

A ideia original do projeto é uma interface enxuta: sem frases desnecessárias, sem explicar o óbvio. Informação secundária — como a etiqueta de nível ao lado da pergunta — fica pequena e discreta de propósito. Antes de acrescentar um texto, verifique se ele muda alguma decisão de quem está resolvendo a questão.

### Feedback imediato em toda ação

Botão clicado, resposta enviada, tema trocado: tudo responde na hora, com a transição de 160ms. A correção é a única operação que pode demorar — ela precisa de estado de carregando, senão o usuário clica duas vezes.

### Erro orienta, não entrega

Quando a resposta está errada, a mensagem diz **o que** falhou sem revelar a solução. É a regra central do projeto: a dica só aparece no 5º erro e a solução no 10º. Mensagem de erro nova deve seguir a mesma linha — dar um norte, não o caminho pronto.
