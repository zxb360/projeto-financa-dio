import { useMemo } from 'react'
import { useFinancial } from '../contexts/FinancialContext'

// Hook que calcula os valores resumidos do perfil financeiro para exibição.
export function useFinancialSummary() {
  const { profile } = useFinancial()

  return useMemo(() => {
    // Soma total das receitas informadas.
    const totalIncome = profile.incomes.reduce((sum, item) => sum + item.amount, 0)
    // Soma total das despesas informadas.
    const totalExpenses = profile.expenses.reduce((sum, item) => sum + item.amount, 0)
    // Soma total das dívidas informadas.
    const totalDebts = profile.debts.reduce((sum, item) => sum + item.amount, 0)
    // Soma total dos ativos informados.
    const totalAssets = profile.assets.reduce((sum, item) => sum + item.amount, 0)
    // O patrimônio líquido é o que sobra após subtrair dívidas dos ativos.
    const netWorth = totalAssets - totalDebts

    const expenseRatio = totalIncome > 0 ? totalExpenses / totalIncome : 1
    const debtRatio = totalIncome > 0 ? totalDebts / (totalIncome * 6) : 1

    // Bônus fictício para quem já possui reserva de emergência.
    const reserveBonus = profile.assets.some((asset) => asset.name.includes('Reserva') && asset.amount > 0)
      ? 12
      : 0

    // Score simulado baseado em receita, despesas, dívidas e reserva.
    const score = Math.max(0, Math.min(100, Math.round(78 - expenseRatio * 28 - debtRatio * 22 + reserveBonus)))

    return {
      totalIncome,
      totalExpenses,
      totalDebts,
      totalAssets,
      netWorth,
      score,
    }
  }, [profile])
}
