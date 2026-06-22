import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { useFinancial } from '../contexts/FinancialContext'
import { AIAssistant } from '../pages/AIAssistant'
import { Assets } from '../pages/Assets'
import { Dashboard } from '../pages/Dashboard'
import { Debts } from '../pages/Debts'
import { Expenses } from '../pages/Expenses'
import { Goals } from '../pages/Goals'
import { Incomes } from '../pages/Incomes'
import { Onboarding } from '../pages/Onboarding'

// Layout protegido que redireciona para onboarding se o usuário ainda não concluiu o cadastro.
function ProtectedLayout() {
  const { profile } = useFinancial()

  if (!profile.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />
  }

  return <AppLayout />
}

// Rotas principais da aplicação.
export function AppRoutes() {
  const { profile } = useFinancial()

  return (
    <Routes>
      {/* Rota de onboarding, bloqueia acesso se já concluído */}
      <Route path="/onboarding" element={profile.onboardingCompleted ? <Navigate to="/" replace /> : <Onboarding />} />

      {/* Rotas protegidas do dashboard e páginas internas */}
      <Route element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="receitas" element={<Incomes />} />
        <Route path="gastos" element={<Expenses />} />
        <Route path="dividas" element={<Debts />} />
        <Route path="patrimonio" element={<Assets />} />
        <Route path="metas" element={<Goals />} />
        <Route path="assistente-ia" element={<AIAssistant />} />
      </Route>

      {/* Redireciona qualquer rota inválida para a página correta dependendo do estado do onboarding. */}
      <Route path="*" element={<Navigate to={profile.onboardingCompleted ? '/' : '/onboarding'} replace />} />
    </Routes>
  )
}
