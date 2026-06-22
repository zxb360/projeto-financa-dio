import { CircleDollarSign } from 'lucide-react'
import { SimpleListPage } from './SimpleListPage'
import { useFinancial } from '../contexts/FinancialContext'

// Página de gastos que usa o componente genérico de lista.
export function Expenses() {
  const { profile } = useFinancial()

  return (
    <SimpleListPage
      title="Gastos"
      description="Entenda para onde seu dinheiro está indo e encontre oportunidades de ajuste."
      items={profile.expenses.map((expense) => ({ id: expense.id, label: expense.category, value: expense.amount }))}
      emptyTitle="Nenhum gasto cadastrado"
      emptyDescription="As despesas serão exibidas após a conclusão do onboarding."
      icon={CircleDollarSign}
    />
  )
}
