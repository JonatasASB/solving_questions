/* Fonte do assets/vendor/codemirror.min.js.

   Este arquivo não vai para o navegador: ele é a entrada do esbuild, que
   segue estes três imports, puxa o grafo inteiro de dependências do
   CodeMirror e escreve tudo num módulo só.

   Para regerar o bundle depois de mudar uma versão no package.json:

       npm install
       npm run build:editor

   O resultado é versionado junto com o código. A hospedagem não reconstrói
   nada: ela só serve o arquivo pronto.

   O que sai daqui é exatamente o que Editor.ativarCodeMirror espera receber
   em index.html. Acrescentar um recurso do CodeMirror (outra linguagem, outro
   tema) é acrescentar um export aqui e rodar o build de novo. */

export { EditorView, basicSetup } from 'codemirror';
export { javascript } from '@codemirror/lang-javascript';
export { oneDark } from '@codemirror/theme-one-dark';
