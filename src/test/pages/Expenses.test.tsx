import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders, renderEmpty } from '../renderWithProviders'
import { Expenses } from '../../pages/Expenses'

beforeEach(() => localStorage.clear())

describe('Expenses', () => {
  it('renderiza o título da página', () => {
    renderWithProviders(<Expenses />)
    expect(screen.getByRole('heading', { name: 'Gastos' })).toBeInTheDocument()
  })

  it('exibe as despesas do perfil demo na tabela', () => {
    renderWithProviders(<Expenses />)
    // getAllByText pois "Moradia" aparece no select e na tabela
    expect(screen.getAllByText('Moradia').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Alimentação').length).toBeGreaterThan(0)
  })

  it('exibe mensagem de vazio quando não há despesas', () => {
    renderEmpty(<Expenses />)
    expect(screen.getByText('Nenhum gasto registrado ainda.')).toBeInTheDocument()
  })

  it('renderiza campo de descrição', () => {
    renderWithProviders(<Expenses />)
    expect(screen.getByPlaceholderText('Descrição do gasto')).toBeInTheDocument()
  })

  it('renderiza campo de valor', () => {
    renderWithProviders(<Expenses />)
    expect(screen.getByPlaceholderText('Valor (R$)')).toBeInTheDocument()
  })

  it('renderiza select de categoria', () => {
    renderWithProviders(<Expenses />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('adiciona nova despesa ao submeter o formulário', () => {
    renderWithProviders(<Expenses />)
    fireEvent.change(screen.getByPlaceholderText('Descrição do gasto'), { target: { value: 'Conta de luz' } })
    fireEvent.change(screen.getByPlaceholderText('Valor (R$)'), { target: { value: '120' } })
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(screen.getByText('Conta de luz')).toBeInTheDocument()
  })

  it('não adiciona despesa com valor zero', () => {
    renderWithProviders(<Expenses />)
    const initialRows = screen.getAllByRole('row').length
    fireEvent.change(screen.getByPlaceholderText('Valor (R$)'), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(screen.getAllByRole('row').length).toBe(initialRows)
  })

  it('não adiciona despesa com valor negativo', () => {
    renderWithProviders(<Expenses />)
    const initialRows = screen.getAllByRole('row').length
    fireEvent.change(screen.getByPlaceholderText('Valor (R$)'), { target: { value: '-50' } })
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(screen.getAllByRole('row').length).toBe(initialRows)
  })

  it('exibe linha de total na tabela', () => {
    renderWithProviders(<Expenses />)
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('limpa descrição e valor após adicionar', () => {
    renderWithProviders(<Expenses />)
    const descInput = screen.getByPlaceholderText('Descrição do gasto') as HTMLInputElement
    const amountInput = screen.getByPlaceholderText('Valor (R$)') as HTMLInputElement
    fireEvent.change(descInput, { target: { value: 'Streaming' } })
    fireEvent.change(amountInput, { target: { value: '50' } })
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(descInput.value).toBe('')
    expect(amountInput.value).toBe('')
  })
})
