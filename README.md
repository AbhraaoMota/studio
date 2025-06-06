# AContaFacil

Este é um aplicativo de gestão financeira construído com Next.js, React, ShadCN UI, Tailwind CSS e Genkit (para funcionalidades de IA).

## Visão Geral

AContaFacil visa simplificar o controle financeiro pessoal através de uma interface intuitiva e funcionalidades inteligentes.

## Funcionalidades Principais (Versão Completa)

*   Lançamentos Simplificados
*   Painel de Controle Dinâmico
*   Relatórios Inteligentes
*   Previsão Inteligente com IA (requer ambiente de servidor)
*   Metas Financeiras
*   Alertas Personalizados
*   Categorização Inteligente com IA (requer ambiente de servidor)

**Nota sobre GitHub Pages:** Ao ser hospedado no GitHub Pages, o aplicativo funciona como um site estático. As funcionalidades que dependem de um backend Node.js (como as integrações com Genkit AI) não estarão disponíveis.

## Como Iniciar (Localmente)

1.  Clone o repositório.
2.  Instale as dependências: `npm install`
3.  Execute o servidor de desenvolvimento: `npm run dev`
4.  Abra [http://localhost:9002](http://localhost:9002) no seu navegador.

## Para Deploy no GitHub Pages

Consulte as instruções para configurar o GitHub Actions e as configurações do repositório para servir a partir da branch `gh-pages`.
Lembre-se de atualizar o `basePath` em `next.config.ts` com o nome do seu repositório.
