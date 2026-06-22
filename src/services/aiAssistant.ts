import type { FinancialProfile } from '../types/financial'

// Função simples que gera uma resposta baseada no perfil financeiro e na pergunta do usuário.
// No futuro, aqui pode ser substituído por uma chamada a uma API de IA real.
export function analyzeFinancialProfile(question: string, profile: FinancialProfile) {
  const topDebt = [...profile.debts].sort((a, b) => b.amount - a.amount)[0]
  const hasCreditCardDebt = profile.debts.some((debt) => debt.type.includes('Cartão') && debt.amount > 0)
  const lowerQuestion = question.toLowerCase()

  // Prioriza resposta sobre dívidas se houver dívida de cartão ou se a pergunta mencionar dívidas.
  if (hasCreditCardDebt || lowerQuestion.includes('dívida')) {
    return 'Com base nos seus dados, recomendamos priorizar a quitação das dívidas de cartão de crédito e negociar taxas antes de assumir novos parcelamentos.'
  }

  // Dicas para metas e sonhos.
  if (lowerQuestion.includes('meta') || lowerQuestion.includes('sonho')) {
    return 'Transforme seus objetivos em metas mensais pequenas. Separe primeiro o valor da meta e depois ajuste gastos variáveis como lazer e compras por impulso.'
  }

  // Dicas para investimento.
  if (lowerQuestion.includes('invest')) {
    return 'Antes de investir mais, fortaleça sua reserva de emergência. Depois disso, escolha investimentos simples e compatíveis com seu prazo.'
  }

  // Resposta genérica baseada na maior dívida.
  return topDebt
    ? `Seu maior ponto de atenção hoje é ${topDebt.type}. Uma boa estratégia inicial é direcionar qualquer renda extra para reduzir esse saldo.`
    : 'Seu perfil está caminhando bem. Continue registrando entradas, gastos e metas para receber recomendações mais precisas.'
}
