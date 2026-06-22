import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Banknote, CreditCard, Gem, Scale, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { useFinancial } from '../contexts/FinancialContext'
import { useFinancialSummary } from '../hooks/useFinancialSummary'
import { formatCurrency } from '../utils/formatters'

const chartColors = ['#059669', '#0891b2', '#f59e0b', '#e11d48', '#7c3aed']

// Página principal que mostra o resumo financeiro em gráficos e cartões.
export function Dashboard() {
  const { profile } = useFinancial()
  const summary = useFinancialSummary()
  const comparisonData = [
    { name: 'Receitas', valor: summary.totalIncome },
    { name: 'Gastos', valor: summary.totalExpenses },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Acompanhe sua situação financeira de forma simples e veja onde agir primeiro."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Score financeiro" value={`${summary.score}/100`} helper="Cálculo fictício inicial" icon={ShieldCheck} />
        <StatCard title="Receita total" value={formatCurrency(summary.totalIncome)} helper="Entradas mensais" icon={Banknote} />
        <StatCard title="Gastos totais" value={formatCurrency(summary.totalExpenses)} helper="Despesas mensais" icon={CreditCard} />
        <StatCard title="Dívidas totais" value={formatCurrency(summary.totalDebts)} helper="Saldos informados" icon={Scale} />
        <StatCard title="Patrimônio líquido" value={formatCurrency(summary.netWorth)} helper="Ativos menos dívidas" icon={Gem} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-950">Distribuição de gastos</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={profile.expenses} dataKey="amount" nameKey="category" innerRadius={58} outerRadius={92} paddingAngle={3}>
                  {profile.expenses.map((expense, index) => (
                    <Cell key={expense.id} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-950">Receitas versus despesas</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R$ ${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]} fill="#0891b2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  )
}
