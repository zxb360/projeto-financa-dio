import type { Expense, FinancialProfile, Income } from '../types/financial';
import { GoogleGenAI } from "@google/genai";


// Acessa a variável de ambiente do Vite.
// Em aplicações Vite, variáveis expostas ao front-end precisam começar com VITE_.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// Inicializa o SDK apenas quando a chave estiver disponível.
// Em static sites, a variável precisa estar configurada nas env vars do serviço de hospedagem.
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

function getClient() {
  if (!genAI) {
    throw new Error('Chave VITE_GEMINI_API_KEY não configurada. Adicione a variável de ambiente no painel do Render (ou outro host) e faça um novo deploy.')
  }
  return genAI
}

// Gera uma resposta conversacional para perguntas financeiras do usuário.
// A função recebe o perfil inteiro para que a IA responda considerando receitas,
// despesas, dívidas, patrimônio e sonhos já cadastrados.
export async function analyzeFinancialProfile(question: string, profile: FinancialProfile) {
  try {
    const totalIncomes = profile.incomes.reduce((sum, inc) => sum + inc.amount, 0)
    const totalExpenses = profile.expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const balance = totalIncomes - totalExpenses

    // Prompt para a IA com o perfil do usuário.
    // O limite de 150 palavras deixa a resposta objetiva e evita textos longos no chat.
    const prompt = `
      Você é um assistente financeiro chamado FinCoach AI.
      Analise o seguinte perfil financeiro e responda à pergunta do usuário de forma clara, objetiva e amigável.
      Seja um coach financeiro que incentiva e guia o usuário para uma vida financeira mais saudável.
      Use no máximo 150 palavras.

      **Perfil Financeiro:**
      - Nome: ${profile.user.name}
      - Idade: ${profile.user.age}
      - Profissão: ${profile.user.profession}
      - Receitas registradas: ${JSON.stringify(profile.incomes)}
      - Total de receitas: R$ ${totalIncomes.toFixed(2)}
      - Despesas registradas: ${JSON.stringify(profile.expenses)}
      - Total de despesas: R$ ${totalExpenses.toFixed(2)}
      - Saldo (receitas - despesas): R$ ${balance.toFixed(2)}
      - Dívidas: ${JSON.stringify(profile.debts)}
      - Patrimônio: ${JSON.stringify(profile.assets)}
      - Metas e Sonhos: ${profile.dreams}

      **Pergunta do Usuário:**
      "${question}"
    `;
    
      const response = await getClient().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        // temperature: 0.7,
        // candidateCount: 1
      });
    
      return response.text;
    } catch (initError) {
      return `Erro ao inicializar o modelo: ${initError}. Verifique o nome do modelo e chame ModelService.ListModels para ver modelos suportados.`;
    }

  }

export interface ImportedStatementEntries {
  incomes: Array<Omit<Income, 'id'>>
  expenses: Array<Omit<Expense, 'id'>>
}

// Prompt reaproveitado para CSV, TXT e PDF.
// Ele força a IA a devolver JSON porque o restante do app precisa salvar dados estruturados,
// não uma resposta em texto livre.
const statementClassificationPrompt = `
  Você é um classificador de extratos bancários brasileiros.
  Leia o extrato enviado e retorne apenas JSON válido no formato:
  {
    "incomes": [{"name": "string", "amount": number, "category": "string", "affectsAssets": boolean}],
    "expenses": [{"description": "string", "category": "string", "amount": number, "affectsAssets": boolean}]
  }

  Regras:
  - Entradas positivas vão para incomes.
  - Saídas negativas, débitos, Pix enviados, tarifas ou compras vão para expenses, sempre com amount positivo.
  - Use categorias como Salário, Renda extra, Alimentação, Moradia, Transporte, Saúde, Lazer, Investimentos, Poupança, Consórcio, Bens, Reserva de emergência ou Outros.
  - affectsAssets deve ser true apenas para Investimentos, Poupança, Consórcio, Bens e Reserva de emergência.
  - Ignore saldo, cabeçalho, rodapé e linhas sem valor financeiro.
`

// Alguns modelos podem devolver texto antes/depois do JSON.
// Esta função recorta apenas o primeiro bloco de objeto para permitir o JSON.parse.
function extractJson(content: string) {
  const start = content.indexOf('{')
  const end = content.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('A IA não retornou um JSON válido.')
  }

  return content.slice(start, end + 1)
}

// Normaliza a resposta da IA.
// Mesmo que alguma chave venha ausente ou em formato inesperado, o app recebe arrays seguros.
function parseImportedEntries(content: string) {
  const parsed = JSON.parse(extractJson(content)) as ImportedStatementEntries

  return {
    incomes: Array.isArray(parsed.incomes) ? parsed.incomes : [],
    expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
  }
}

// Converte arquivos binários para base64.
// Isso é necessário para enviar PDFs ao Gemini usando inlineData no navegador.
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
}

// Classifica extratos anexados pelo usuário.
// - PDF: enviado como arquivo binário/base64 para a IA interpretar o documento.
// - CSV/TXT: lidos como texto e enviados no próprio prompt.
// O retorno é sempre o mesmo contrato: receitas e gastos prontos para entrar no contexto.
export async function parseBankStatement(file: File): Promise<ImportedStatementEntries> {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const response = await getClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        statementClassificationPrompt,
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: arrayBufferToBase64(await file.arrayBuffer()),
          },
        },
      ],
    });

    return parseImportedEntries(response.text ?? '')
  }

  const statementText = await file.text()

  const response = await getClient().models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${statementClassificationPrompt}\n\nExtrato:\n${statementText}`,
  });

  return parseImportedEntries(response.text ?? '')
}
