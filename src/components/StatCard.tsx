import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  helper: string
  icon: LucideIcon
}

// Cartão de métrica usado no dashboard para exibir valores importantes.
export function StatCard({ title, value, helper, icon: Icon }: StatCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
          <Icon size={20} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{helper}</p>
    </article>
  )
}
