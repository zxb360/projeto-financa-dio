import { useState } from 'react'
import { Banknote } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useFinancial } from '../contexts/FinancialContext'
import { incomeCategories, isAssetCategory } from '../data/financialCategories'
import { formatCurrency } from '../utils/formatters'

export function Incomes() {
  const { profile, addIncome } = useFinancial()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  // Começa com a primeira categoria padronizada para evitar receita sem classificação.
  const [category, setCategory] = useState(incomeCategories[0])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount.replace(',', '.'))
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return
    // affectsAssets informa ao contexto se essa receita também deve refletir no patrimônio.
    addIncome({ name: name.trim(), amount: parsed, category, affectsAssets: isAssetCategory(category) })
    setName('')
    setAmount('')
  }

  // Total exibido no rodapé da tabela de receitas.
  const total = profile.incomes.reduce((sum, inc) => sum + inc.amount, 0)

  return (
    <>
      <PageHeader
        title="Receitas"
        description="Registre suas fontes de renda e acompanhe o total."
      />

      {/* Formulário manual para lançar uma receita com nome, categoria e valor. */}
      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Nome da receita"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-40 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-w-44 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {incomeCategories.map((item) => (
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
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Banknote size={16} /> Adicionar
        </button>
      </form>

      {/* Tabela das receitas salvas no contexto/localStorage. */}
      {profile.incomes.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 dark:text-slate-400">Receita</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 dark:text-slate-400">Categoria</th>
                <th className="px-5 py-3 text-right font-semibold text-slate-500 dark:text-slate-400">Valor</th>
              </tr>
            </thead>
            <tbody>
              {profile.incomes.map((inc) => (
                <tr key={inc.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{inc.name}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{inc.category ?? 'Receita'}</td>
                  <td className="px-5 py-3 text-right font-medium text-emerald-600">{formatCurrency(inc.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="px-5 py-3 font-bold text-slate-800 dark:text-slate-100" colSpan={2}>Total</td>
                <td className="px-5 py-3 text-right font-bold text-emerald-600">{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma receita registrada ainda.</p>
      )}
    </>
  )
}
