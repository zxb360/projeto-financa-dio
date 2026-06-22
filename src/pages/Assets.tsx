import { Gem } from 'lucide-react'
import { SimpleListPage } from './SimpleListPage'
import { useFinancial } from '../contexts/FinancialContext'

// Página de patrimônio que usa o componente genérico de lista.
export function Assets() {
  const { profile } = useFinancial()

  return (
    <SimpleListPage
      title="Patrimônio"
      description="Acompanhe seus ativos e visualize a base do seu patrimônio líquido."
      items={profile.assets.map((asset) => ({ id: asset.id, label: asset.name, value: asset.amount }))}
      emptyTitle="Nenhum patrimônio cadastrado"
      emptyDescription="Informe seus ativos no onboarding para acompanhar sua evolução."
      icon={Gem}
    />
  )
}
