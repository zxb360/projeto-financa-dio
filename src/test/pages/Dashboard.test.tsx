import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../renderWithProviders'
import { Dashboard } from '../../pages/Dashboard'
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

beforeEach(() => localStorage.clear())

describe('Dashboard', () => {
  it('renderiza o título Dashboard', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('exibe o card de Score financeiro', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Score financeiro')).toBeInTheDocument()
  })

  it('exibe o card de Receita total', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Receita total')).toBeInTheDocument()
  })

  it('exibe o card de Gastos totais', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Gastos totais')).toBeInTheDocument()
  })

  it('exibe o card de Dívidas totais', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Dívidas totais')).toBeInTheDocument()
  })

  it('exibe o card de Patrimônio líquido', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Patrimônio líquido')).toBeInTheDocument()
  })

  it('exibe o título do gráfico de distribuição de gastos', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Distribuição de gastos')).toBeInTheDocument()
  })

  it('exibe o título do gráfico receitas versus despesas', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Receitas versus despesas')).toBeInTheDocument()
  })
})
