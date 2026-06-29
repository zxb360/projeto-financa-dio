import axios from 'axios'
import type { Expense, FinancialProfile, Income } from '../types/financial'

function getAiApiUrl(): string {
  return (import.meta.env.VITE_AI_API_URL as string | undefined)?.trim() || 'http://localhost:3000/assistente-ai'
}

type AssistantApiResponse = {
  text?: string
  response?: string
  message?: string
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

function extractGeneratedText(data: AssistantApiResponse | string | undefined): string {  
  // Se a API externa (NestJS) retornar o texto diretamente (string pura), usamos essa resposta.
  if (typeof data === 'string' && data.trim()) {
    return data
  } else if (typeof data !== 'object' || data === null) {
    return 'A IA não forneceu uma resposta inteligível.'
  }

  // Tenta extrair o texto da estrutura de resposta do Gemini (ou similar).
  const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (typeof candidateText === 'string' && candidateText.trim()) {
    return candidateText
  }  

  // Fallback para outros formatos comuns de resposta de APIs (NestJS pode usar 'text', 'response' ou 'message').
  const directText = data?.text ?? data?.response ?? data?.message
  if (typeof directText === 'string' && directText.trim()) {
    return directText
  }
  
  return 'Nenhuma resposta gerada.'
}

async function generate(prompt: string): Promise<string> {
  const response = await axios.post(getAiApiUrl(), {
    prompt,
    model: 'gemini-2.5-flash',
    contents: { parts: [{ text: prompt }] },
  })

  return extractGeneratedText(response.data as AssistantApiResponse)
}

async function generateWithFile(prompt: string, mimeType: string, base64Data: string): Promise<string> {
  const response = await axios.post(getAiApiUrl(), {
    prompt,
    model: 'gemini-2.5-flash',
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64Data } },
        ],
      },
    ],
  })

  return extractGeneratedText(response.data as AssistantApiResponse)
}

export async function analyzeFinancialProfile(question: string, profile: FinancialProfile) {
  try {
    const totalIncomes = profile.incomes.reduce((sum, inc) => sum + inc.amount, 0)
    const totalExpenses = profile.expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const balance = totalIncomes - totalExpenses

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
    `

    return await generate(prompt)
  } catch (error) {
    return `Erro ao consultar a IA: ${error instanceof Error ? error.message : error}`
  }
}

export interface ImportedStatementEntries {
  incomes: Array<Omit<Income, 'id'>>
  expenses: Array<Omit<Expense, 'id'>>
}

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
// - Responda APENAS com o objeto JSON, sem nenhum texto ou explicação adicional.
function extractJson(content: string) {
  const start = content.indexOf('{')
  const end = content.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('A IA não retornou um JSON válido.')
  }

  return content.slice(start, end + 1)
}

function parseImportedEntries(content: string): ImportedStatementEntries {
  try {
    const jsonString = extractJson(content)
    const parsed = JSON.parse(jsonString) as Partial<ImportedStatementEntries>
  
    return {
      incomes: Array.isArray(parsed.incomes) ? parsed.incomes : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
    }
  } catch (error: unknown) {
    console.error('Erro ao parsear JSON da IA:', error)
    throw new Error('A IA não retornou um JSON válido ou no formato esperado.', {
      cause: error,
    })
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}

export async function parseBankStatement(file: File): Promise<ImportedStatementEntries> {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const base64 = arrayBufferToBase64(await file.arrayBuffer())
    const text = await generateWithFile(statementClassificationPrompt, 'application/pdf', base64)
    return parseImportedEntries(text)
  }

  const statementText = await file.text()
  const text = await generate(`${statementClassificationPrompt}\n\nExtrato:\n${statementText}`)
  return parseImportedEntries(text)
}
