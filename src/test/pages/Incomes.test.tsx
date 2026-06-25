import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders, renderEmpty } from '../renderWithProviders'
import { Incomes } from '../../pages/Incomes'

beforeEach(() => localStorage.clear())

describe('Incomes', () => {
  it('renderiza o título da página', () => {
    renderWithProviders(<Incomes />)
    expect(screen.getByRole('heading', { name: 'Receitas' })).toBeInTheDocument()
  })

  it('exibe as receitas do perfil demo na tabela', () => {
    renderWithProviders(<Incomes />)
    // getAllByText pois nomes podem aparecer no select e na tabela
    expect(screen.getAllByText('Salário').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Renda extra').length).toBeGreaterThan(0)
  })

  it('exibe mensagem de vazio quando não há receitas', () => {
    renderEmpty(<Incomes />)
    expect(screen.getByText('Nenhuma receita registrada ainda.')).toBeInTheDocument()
  })

  it('renderiza campo de nome da receita', () => {
    renderWithProviders(<Incomes />)
    expect(screen.getByPlaceholderText('Nome da receita')).toBeInTheDocument()
  })

  it('renderiza campo de valor', () => {
    renderWithProviders(<Incomes />)
    expect(screen.getByPlaceholderText('Valor (R$)')).toBeInTheDocument()
  })

  it('renderiza select de categoria', () => {
    renderWithProviders(<Incomes />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('adiciona nova receita ao submeter o formulário', () => {
    renderWithProviders(<Incomes />)
    fireEvent.change(screen.getByPlaceholderText('Nome da receita'), { target: { value: 'Bonus' } })
    fireEvent.change(screen.getByPlaceholderText('Valor (R$)'), { target: { value: '1500' } })
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(screen.getByText('Bonus')).toBeInTheDocument()
  })

  it('não adiciona receita com nome vazio', () => {
    renderWithProviders(<Incomes />)
    const initialRows = screen.getAllByRole('row').length
    fireEvent.change(screen.getByPlaceholderText('Valor (R$)'), { target: { value: '500' } })
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(screen.getAllByRole('row').length).toBe(initialRows)
  })

  it('não adiciona receita com valor zero', () => {
    renderWithProviders(<Incomes />)
    const initialRows = screen.getAllByRole('row').length
    fireEvent.change(screen.getByPlaceholderText('Nome da receita'), { target: { value: 'Teste' } })
    fireEvent.change(screen.getByPlaceholderText('Valor (R$)'), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(screen.getAllByRole('row').length).toBe(initialRows)
  })

  it('exibe linha de total na tabela', () => {
    renderWithProviders(<Incomes />)
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('limpa o formulário após adicionar', () => {
    renderWithProviders(<Incomes />)
    const nameInput = screen.getByPlaceholderText('Nome da receita') as HTMLInputElement
    const amountInput = screen.getByPlaceholderText('Valor (R$)') as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'Extra' } })
    fireEvent.change(amountInput, { target: { value: '300' } })
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(nameInput.value).toBe('')
    expect(amountInput.value).toBe('')
  })
})
