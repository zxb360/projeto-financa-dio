import { Banknote } from 'lucide-react'
import { SimpleListPage } from './SimpleListPage'
import { useFinancial } from '../contexts/FinancialContext'

// Página de receitas que usa o componente genérico de lista.
export function Incomes() {
  const { profile } = useFinancial()

  return (
    <SimpleListPage
      title="Receitas"
      description="Veja suas fontes de renda mensal e acompanhe o quanto entra no orçamento."
      items={profile.incomes.map((income) => ({ id: income.id, label: income.name, value: income.amount }))}
      emptyTitle="Nenhuma receita cadastrada"
      emptyDescription="Conclua o onboarding para preencher seus dados financeiros iniciais."
      icon={Banknote}
    />
  )
}
