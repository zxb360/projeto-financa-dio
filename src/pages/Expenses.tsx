import { useState } from 'react'
import { CircleDollarSign } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useFinancial } from '../contexts/FinancialContext'
import { expenseCategories, isAssetCategory } from '../data/financialCategories'
import { formatCurrency } from '../utils/formatters'

export function Expenses() {
  const { profile, addExpense } = useFinancial()
  const [description, setDescription] = useState('')
  // A categoria padronizada melhora relatórios e permite detectar gastos patrimoniais.
  const [category, setCategory] = useState(expenseCategories[0])
  const [amount, setAmount] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount.replace(',', '.'))
    if (!category.trim() || isNaN(parsed) || parsed <= 0) return
    // Descrição é opcional; se o usuário não preencher, usamos a categoria como fallback.
    // affectsAssets permite que investimentos, poupança, consórcio e bens somem patrimônio.
    addExpense({ category: category.trim(), description: description.trim() || category.trim(), amount: parsed, affectsAssets: isAssetCategory(category) })
    setDescription('')
    setAmount('')
  }

  // Total exibido no rodapé da tabela de gastos.
  const total = profile.expenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <>
      <PageHeader
        title="Gastos"
        description="Registre suas despesas e acompanhe para onde o dinheiro está indo."
      />

      {/* Formulário manual para lançar uma despesa com descrição, categoria e valor. */}
      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Descrição do gasto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 min-w-40 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-w-44 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {expenseCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Valor (R$)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
          className="w-40 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          <CircleDollarSign size={16} /> Adicionar
        </button>
      </form>

      {/* Tabela dos gastos salvos no contexto/localStorage. */}
      {profile.expenses.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 dark:text-slate-400">Categoria</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 dark:text-slate-400">Descrição</th>
                <th className="px-5 py-3 text-right font-semibold text-slate-500 dark:text-slate-400">Valor</th>
              </tr>
            </thead>
            <tbody>
              {profile.expenses.map((exp) => (
                <tr key={exp.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{exp.category}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{exp.description ?? exp.category}</td>
                  <td className="px-5 py-3 text-right font-medium text-rose-600">{formatCurrency(exp.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="px-5 py-3 font-bold text-slate-800 dark:text-slate-100" colSpan={2}>Total</td>
                <td className="px-5 py-3 text-right font-bold text-rose-600">{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum gasto registrado ainda.</p>
      )}
    </>
  )
}
