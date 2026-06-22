import { PageHeader } from '../components/PageHeader'
import { useFinancial } from '../contexts/FinancialContext'
import { formatCurrency } from '../utils/formatters'

const priorityStyles = {
  Alta: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/25',
  Média: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/25',
  Baixa: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/25',
}

// Página que mostra todas as dívidas em uma tabela ordenada por prioridade.
export function Debts() {
  const { profile } = useFinancial()

  return (
    <>
      <PageHeader title="Dívidas" description="Organize seus saldos por tipo e prioridade para decidir o próximo passo." />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-slate-100 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-5 py-4 font-semibold">Tipo</th>
              <th className="px-5 py-4 font-semibold">Valor</th>
              <th className="px-5 py-4 font-semibold">Prioridade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {profile.debts.map((debt) => (
              <tr key={debt.id}>
                <td className="px-5 py-4 font-medium text-slate-950 dark:text-slate-100">{debt.type}</td>
                <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{formatCurrency(debt.amount)}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${priorityStyles[debt.priority]}`}>
                    {debt.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
