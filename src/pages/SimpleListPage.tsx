import type { LucideIcon } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { formatCurrency } from '../utils/formatters'

interface ListItem {
  id: string
  label: string
  value: number
}

interface SimpleListPageProps {
  title: string
  description: string
  items: ListItem[]
  emptyTitle: string
  emptyDescription: string
  icon: LucideIcon
}

// Página genérica para exibir listas simples de receitas, despesas ou ativos.
// Exibe um estado vazio quando não há itens e um cartão para cada item quando há dados.
export function SimpleListPage({ title, description, items, emptyTitle, emptyDescription, icon }: SimpleListPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      {items.length === 0 ? (
        <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-100">{formatCurrency(item.value)}</p>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
