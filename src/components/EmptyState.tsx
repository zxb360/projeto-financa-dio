import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

// Componente genérico para exibir um estado vazio quando não há dados.
export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={24} />
      </div>
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  )
}
