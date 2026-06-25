import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FinancialProvider } from '../../contexts/FinancialContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { AppRoutes } from '../../routes/AppRoutes'
import { demoFinancialProfile, emptyFinancialProfile } from '../../data/mockFinancialProfile'
import type { ReactNode } from 'react'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
  BarChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}))

vi.mock('../../services/aiAssistant', () => ({
  analyzeFinancialProfile: vi.fn().mockResolvedValue('OK'),
}))

function renderRoutes(profile = demoFinancialProfile, initialEntries = ['/']) {
  localStorage.setItem('fincoach-ai-profile', JSON.stringify(profile))
  return render(
    <ThemeProvider>
      <FinancialProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <AppRoutes />
        </MemoryRouter>
      </FinancialProvider>
    </ThemeProvider>,
  )
}

beforeEach(() => localStorage.clear())

describe('AppRoutes', () => {
  it('redireciona para /onboarding quando onboarding não foi concluído', () => {
    renderRoutes(emptyFinancialProfile)
    expect(screen.getByText(/vamos entender sua vida financeira/i)).toBeInTheDocument()
  })

  it('exibe dashboard quando onboarding foi concluído', () => {
    renderRoutes(demoFinancialProfile)
    // Dashboard aparece no heading e no nav link, usar heading para ser preciso
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('redireciona de /onboarding para / quando já concluiu onboarding', () => {
    renderRoutes(demoFinancialProfile, ['/onboarding'])
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('redireciona rota inválida para dashboard quando onboarding concluído', () => {
    renderRoutes(demoFinancialProfile, ['/rota-inexistente'])
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('redireciona rota inválida para onboarding quando não concluído', () => {
    renderRoutes(emptyFinancialProfile, ['/rota-inexistente'])
    expect(screen.getByText(/vamos entender sua vida financeira/i)).toBeInTheDocument()
  })
})
