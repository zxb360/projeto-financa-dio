import type { FinancialProfile } from '../types/financial';
import { GoogleGenAI } from "@google/genai";


// Acessa a variável de ambiente do Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("A chave VITE_GEMINI_API_KEY não está definida no arquivo .env");
}

// Inicializa a instância do SDK
const genAI = new GoogleGenAI({
  apiKey,
});

export async function analyzeFinancialProfile(question: string, profile: FinancialProfile) {
  try {
    // Prompt para a IA com o perfil do usuário.
    const prompt = `
      Você é um assistente financeiro chamado FinCoach AI.
      Analise o seguinte perfil financeiro e responda à pergunta do usuário de forma clara, objetiva e amigável.
      Seja um coach financeiro que incentiva e guia o usuário para uma vida financeira mais saudável.
      Use no máximo 150 palavras.

      **Perfil Financeiro:**
      - Nome: ${profile.user.name}
      - Idade: ${profile.user.age}
      - Profissão: ${profile.user.profession}
      - Renda Mensal: ${JSON.stringify(profile.incomes)}
      - Despesas Mensais: ${JSON.stringify(profile.expenses)}
      - Dívidas: ${JSON.stringify(profile.debts)}
      - Patrimônio: ${JSON.stringify(profile.assets)}
      - Metas e Sonhos: ${profile.dreams}

      **Pergunta do Usuário:**
      "${question}"
    `;
    
      const response = await genAI.models.generateContent({
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
