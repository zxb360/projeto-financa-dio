import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FinancialProvider } from '../../contexts/FinancialContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { AppLayout } from '../../components/layout/AppLayout'
import { demoFinancialProfile } from '../../data/mockFinancialProfile'
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

// Outlet precisa de rota para renderizar, usamos um filho simples
function renderLayout(profile = demoFinancialProfile) {
  localStorage.setItem('fincoach-ai-profile', JSON.stringify(profile))
  return (
    <ThemeProvider>
      <FinancialProvider>
        <MemoryRouter>
          <AppLayout />
        </MemoryRouter>
      </FinancialProvider>
    </ThemeProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('AppLayout', () => {
  it('renderiza o nome do app na sidebar', async () => {
    const { render } = await import('@testing-library/react')
    render(renderLayout())
    expect(screen.getByText('FinCoach AI')).toBeInTheDocument()
  })

  it('exibe boas-vindas com nome do usuário', async () => {
    const { render } = await import('@testing-library/react')
    render(renderLayout())
    expect(screen.getByText('Jaeder')).toBeInTheDocument()
  })

  it('exibe as iniciais do usuário no avatar', async () => {
    const { render } = await import('@testing-library/react')
    render(renderLayout())
    // "Jaeder" = 1 palavra => inicial "J"
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('exibe score financeiro no header', async () => {
    const { render } = await import('@testing-library/react')
    render(renderLayout())
    expect(screen.getAllByText(/Score financeiro/i).length).toBeGreaterThan(0)
  })

  it('abre a sidebar ao clicar no botão de menu', async () => {
    const { render } = await import('@testing-library/react')
    render(renderLayout())
    const menuBtn = screen.getByRole('button', { name: /abrir menu/i })
    fireEvent.click(menuBtn)
    expect(screen.getByRole('button', { name: /fechar menu/i })).toBeInTheDocument()
  })

  it('alterna o tema ao clicar no botão de tema', async () => {
    const { render } = await import('@testing-library/react')
    render(renderLayout())
    const themeBtn = screen.getByRole('button', { name: /alternar tema/i })
    fireEvent.click(themeBtn)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('exibe os links de navegação', async () => {
    const { render } = await import('@testing-library/react')
    render(renderLayout())
    expect(screen.getByRole('link', { name: /receitas/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /gastos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /metas/i })).toBeInTheDocument()
  })

  it('exibe FC quando nome do usuário está vazio', async () => {
    const { render } = await import('@testing-library/react')
    const emptyUser = { ...demoFinancialProfile, user: { name: '', profession: '', age: 0 } }
    render(renderLayout(emptyUser))
    expect(screen.getByText('FC')).toBeInTheDocument()
  })
})
