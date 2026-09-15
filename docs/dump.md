## Resolução de questões

# Projeto para ajudar iniciantes e também quem já tem experiência em treinar sua lógica de programação

# Interface
- A interface começará com as opções de linguagens que o usuário deverá clicar e escolher para treinar (No momento coloque somente JavsScript, mas futuramente terá outras linguagens), esse botão deve ter borda arredondada e deverá ser pequeno.
- Após isso uma sessão que o usuário escolherá o nível das questões que ele irá responder (segue o mesmo padrão de botão da escolha de linguagem)
- deverá ser intuitiva com poucas informações e sem frases desnecessárias
- não terá limite de largura, pode usar toda a tela porém sempre se atente para deixar adaptavel para mobile
- as cores serão branco e verde claro(light mode) e preto e azul claro (dark mode), deixe um botão ao lado esquerdo para que o usuário mude
- no HEADER terá a logo ao lado esquerdo ao meio o nome do site e ao lado direito um span que irá contar a quantidade de pontos daquele usuário, e o botão de mudança de cor (dark/light)
- no MAIN é onde terá as perguntas e respostas, terá uma barra acima que fará o progresso do usuário, essa barra começa vermelha e vai mudando de cor na medida que o usuário vai progredindo e vai ficando verde.
- Ao lado direito deixe os botões de escolha de níveis caso o usuário queira mudar os níveis de resoluções, porém seu avanço não deverá ser zerado.
- ainda no MAIN terá o campo de pergunta, as perguntas serão classificas com fácil, média, difícil e nível Deus, essa informação é você quem determinará com base no nível da resolução, no campo de pergunta deverá ter um span ao lado da pergunta informando o nível daquela pergunta, coloque o font-size bem pequeno com borda arredondada, pois é uma informação não tão relevante.
- ainda no MAIN terá um campo de como você vai decidir como o usuário responderá aquele problema, ex.: **PERGUNTA PARA CALCULAR A MÉDIA** você que vai informar os parâmetros para aquela resolução Ex.: **CONSIDERE N1 COM PRIMEIRA NOTA N2 COMO SEGUNDA NOTA N3 COMO TERCEIRA NOTA E MEDIA COMO A MEDIA**, você deverá informar como o usuário deverá fazer e quais os nomes das variáveis, mas não dê a resposta, somente um norte. 
- ainda no MAIN no campo de resposta, deverá ter um espaça que simula uma IDE como o vscode por exemplo
- e ao finalizar o resolução um campo que mostrará se a resposta está correta ou não, caso esteja errado não dê a resposta, deixe o usuário tentar 5 vezes, após as 5 tentativas você dará dicas para a resolução daquela questão.
- deverá ter um botão para pular a questão


# Questões e Respostas
- Como informado acima as questões serão de 4 níveis (fácil, médio, difícil e nível Deus), você quem fará a elaboração dessas questões, use como exemplo sites como leetcode e beecrowd.
- Não use termos muito técnicos e se usar deixe explicado de forma mais fácil.
- As questões devem ser de JavaScript Vanilla
- No início você fará somente  100 questões, as classificaçaõ de dificuldade é você quem fará, tal que os níveis fáceis devem envolver coisas básicas como somar 2 números, somar média, fazer uma função para descobrir se o número é impar o u par e nível Deus questões que envolvem assuntos mais avançados como POO, uso de API (use APIs públicas e quem podem ser usadas sem problema, deixe o link da API para o usuário se basear nas requisições) mas faça questões que engloblam todo o Js, métodos, funções próprias, métodos de iteração e as classifique como desejar
- Caso o usuário acerte a resposta, deixe uma mensagem parabenziando e informando que seu avanço foi computado.
- As questões devem ter pontos, tal que fácil são 3 pontos e nível Deus 10 pontos.
- Caso o usuário erre ou cometa um erro de sintaxe, deixe o código vermelho, após 5 tentativas falhar, você deverá dar um dica, mas não entregue a resposta. Após 5 erros novamente mostre a forma correta de fazer o código e explique linha por linha.
- Faça a separação de arquivos como desejar, porém separe-os dentro de um assets, somente o index deverá ficar fora do assets.
