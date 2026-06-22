import { zodResolver } from '@hookform/resolvers/zod'
import { Target } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { useFinancial } from '../contexts/FinancialContext'
import { formatCurrency } from '../utils/formatters'

const goalSchema = z.object({
  name: z.string().min(2, 'Informe o nome da meta'),
  targetAmount: z.coerce.number().positive('Informe um valor maior que zero'),
  months: z.coerce.number().int().positive('Informe um prazo válido'),
})

type GoalFormData = z.infer<typeof goalSchema>
type GoalFormInput = z.input<typeof goalSchema>

export function Goals() {
  const { profile, addGoal } = useFinancial()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormInput, unknown, GoalFormData>({ resolver: zodResolver(goalSchema) })

  // Salva uma nova meta no perfil e limpa o formulário.
  function onSubmit(data: GoalFormData) {
    addGoal(data)
    reset()
  }

  return (
    <>
      <PageHeader title="Metas" description="Cadastre seus objetivos e veja quanto precisa guardar por mês." />
      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nome da meta</span>
              <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" {...register('name')} />
              {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name.message}</p>}
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Valor desejado</span>
              <input type="number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" {...register('targetAmount')} />
              {errors.targetAmount && <p className="mt-1 text-sm text-rose-600">{errors.targetAmount.message}</p>}
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Prazo em meses</span>
              <input type="number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" {...register('months')} />
              {errors.months && <p className="mt-1 text-sm text-rose-600">{errors.months.message}</p>}
            </label>
          </div>
          <button className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700" type="submit">
            Cadastrar meta
          </button>
        </form>

        {profile.goals.length === 0 ? (
          <EmptyState icon={Target} title="Nenhuma meta cadastrada" description="Crie sua primeira meta para visualizar o valor mensal necessário." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {profile.goals.map((goal) => (
              <article key={goal.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{goal.name}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-100">{formatCurrency(goal.targetAmount)}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Guardar {formatCurrency(goal.targetAmount / goal.months)} por mês durante {goal.months} meses.
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
