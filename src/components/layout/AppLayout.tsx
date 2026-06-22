import { NavLink, Outlet } from 'react-router-dom'
import {
  Banknote,
  Bot,
  ChartNoAxesCombined,
  CircleDollarSign,
  CreditCard,
  Gem,
  LayoutDashboard,
  Menu,
  Target,
} from 'lucide-react'
import { useState } from 'react'
import { useFinancial } from '../../contexts/FinancialContext'
import { useFinancialSummary } from '../../hooks/useFinancialSummary'

// Definição dos itens do menu lateral usados no layout principal.
const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/receitas', label: 'Receitas', icon: Banknote },
  { to: '/gastos', label: 'Gastos', icon: CircleDollarSign },
  { to: '/dividas', label: 'Dívidas', icon: CreditCard },
  { to: '/patrimonio', label: 'Patrimônio', icon: Gem },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/assistente-ia', label: 'Assistente IA', icon: Bot },
]

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile } = useFinancial()
  const { score } = useFinancialSummary()
  const initials = profile.user.name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* Menu lateral fixo com navegação principal */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <ChartNoAxesCombined size={24} />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">FinCoach AI</p>
            <p className="text-sm text-slate-500">Seu plano financeiro</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden"
          aria-label="Fechar menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex min-h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="hidden md:block">
            <p className="text-sm text-slate-500">Bem-vindo de volta</p>
            <h1 className="text-xl font-bold text-slate-950">{profile.user.name || 'Usuário FinCoach'}</h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-right">
              <p className="text-xs font-medium text-emerald-700">Score financeiro</p>
              <p className="text-lg font-bold text-emerald-800">{score}/100</p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {initials || 'FC'}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
