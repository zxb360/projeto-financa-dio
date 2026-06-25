# FinCoach AI

Um app de organização financeira feito com React, TypeScript e Vite. A proposta é ajudar o usuário a registrar receitas, gastos, dívidas, patrimônio e metas em uma interface simples, com um assistente de IA para analisar o perfil financeiro e importar extratos bancários.

A ideia é bem direta: menos planilha assustando a pessoa, mais clareza para decidir o próximo passo.

## O Que O Projeto Faz

- Cadastro inicial por onboarding com dados pessoais, receitas, despesas, dívidas, patrimônio e sonhos.
- Dashboard com resumo financeiro, score fictício, gráficos e visão de patrimônio líquido.
- Registro manual de receitas.
- Registro manual de gastos.
- Controle de dívidas por tipo, valor e prioridade.
- Visualização de patrimônio.
- Cadastro de metas financeiras.
- Alternância entre tema claro e escuro.
- Persistência local com `localStorage`.
- Assistente IA com perguntas sobre o perfil financeiro.
- Importação de extrato bancário por arquivo `PDF`, `CSV` ou `TXT`.
- Ditado por voz no campo do assistente, quando o navegador suporta a Web Speech API.

## Funcionalidades De IA

O projeto usa o SDK `@google/genai` com o modelo `gemini-2.5-flash`.

Atualmente existem dois fluxos principais:

1. Conversa financeira:
   O usuário faz uma pergunta no Assistente IA e o app envia o perfil financeiro atual para o Gemini. A resposta considera receitas, gastos, dívidas, patrimônio, saldo e sonhos cadastrados.

2. Importação de extrato:
   O usuário anexa um arquivo `PDF`, `CSV` ou `TXT`. A IA lê o conteúdo e tenta transformar as movimentações em dados estruturados:
   - receitas entram na tabela de receitas;
   - saídas, compras, tarifas e débitos entram na tabela de gastos;
   - itens como investimento, poupança, consórcio, bens e reserva de emergência também impactam patrimônio.

## Categorias E Patrimônio

Receitas e gastos agora possuem categorias padronizadas. Isso melhora a leitura dos dados e prepara o projeto para filtros, relatórios e análises mais inteligentes.

Algumas categorias são consideradas patrimoniais:

- Investimentos
- Poupança
- Consórcio
- Bens
- Reserva de emergência

Quando uma movimentação usa uma dessas categorias, o valor também é refletido na aba de patrimônio. Por exemplo: um gasto classificado como `Investimentos` continua sendo uma saída no mês, mas aumenta o ativo `Investimentos` no patrimônio.

## Estrutura Principal

```txt
src/
  components/          Componentes reutilizáveis de UI
  contexts/            Contextos globais da aplicação
  data/                Dados auxiliares e categorias financeiras
  hooks/               Hooks de cálculo e resumo financeiro
  pages/               Páginas principais do app
  routes/              Configuração de rotas
  services/            Integrações externas, incluindo IA
  types/               Tipos TypeScript do domínio financeiro
  utils/               Funções utilitárias
```

Arquivos importantes:

- `src/contexts/FinancialContext.tsx`: centraliza o perfil financeiro, persistência local e regras de atualização.
- `src/services/aiAssistant.ts`: conversa com o Gemini e classifica extratos anexados.
- `src/data/financialCategories.ts`: define categorias de receitas, gastos e patrimônio.
- `src/pages/AIAssistant.tsx`: tela de chat, upload de extrato e ditado por voz.
- `src/pages/Incomes.tsx`: cadastro e listagem de receitas.
- `src/pages/Expenses.tsx`: cadastro e listagem de gastos.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Zod
- Recharts
- Lucide React
- Google GenAI SDK

## Como Rodar

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto com a chave do Gemini:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

Gere a versão de produção:

```bash
npm run build
```

## Observações Sobre Extratos

A importação funciona melhor quando o extrato possui data, descrição e valor de forma legível.

Formatos aceitos:

- `PDF`
- `CSV`
- `TXT`

PDFs escaneados como imagem podem depender da capacidade do modelo de interpretar o documento visualmente. PDFs textuais ou CSVs tendem a ser mais confiáveis.

## Estado Atual

O app ainda usa `localStorage`, então os dados ficam salvos apenas no navegador do usuário. Isso é ótimo para protótipo e demonstração, mas em uma versão maior seria interessante evoluir para:

- autenticação de usuário;
- banco de dados;
- histórico de importações;
- revisão antes de confirmar lançamentos importados;
- edição e exclusão de receitas, gastos, dívidas e patrimônio;
- conciliação bancária;
- relatórios por período;
- testes automatizados.

## Scripts Disponíveis

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Nota Final

Este projeto nasceu como um organizador financeiro didático, mas já ganhou uma alma de produto: ele não só registra números, ele tenta ajudar o usuário a entender o que aqueles números estão dizendo. Pequeno, prático e com espaço para crescer.
