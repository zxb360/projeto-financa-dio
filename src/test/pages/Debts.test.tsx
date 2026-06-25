import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../renderWithProviders'
import { Debts } from '../../pages/Debts'

beforeEach(() => localStorage.clear())

describe('Debts', () => {
  it('renderiza o título da página', () => {
    renderWithProviders(<Debts />)
    expect(screen.getByText('Dívidas')).toBeInTheDocument()
  })

  it('exibe os tipos de dívida do perfil demo', () => {
    renderWithProviders(<Debts />)
    expect(screen.getByText('Cartão de crédito')).toBeInTheDocument()
    expect(screen.getByText('Empréstimos')).toBeInTheDocument()
    expect(screen.getByText('Financiamentos')).toBeInTheDocument()
  })

  it('exibe badges de prioridade corretamente', () => {
    renderWithProviders(<Debts />)
    expect(screen.getByText('Alta')).toBeInTheDocument()
    expect(screen.getByText('Média')).toBeInTheDocument()
    expect(screen.getByText('Baixa')).toBeInTheDocument()
  })

  it('exibe os cabeçalhos da tabela', () => {
    renderWithProviders(<Debts />)
    expect(screen.getByText('Tipo')).toBeInTheDocument()
    expect(screen.getByText('Valor')).toBeInTheDocument()
    expect(screen.getByText('Prioridade')).toBeInTheDocument()
  })

  it('formata os valores monetários', () => {
    renderWithProviders(<Debts />)
    expect(screen.getByText(/1\.800/)).toBeInTheDocument()
    expect(screen.getByText(/3\.200/)).toBeInTheDocument()
  })
})
