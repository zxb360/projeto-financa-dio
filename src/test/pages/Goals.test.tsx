import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../renderWithProviders'
import { Goals } from '../../pages/Goals'
import { emptyFinancialProfile } from '../../data/mockFinancialProfile'

beforeEach(() => localStorage.clear())

describe('Goals', () => {
  it('renderiza o título da página', () => {
    renderWithProviders(<Goals />)
    expect(screen.getByText('Metas')).toBeInTheDocument()
  })

  it('exibe estado vazio quando não há metas', () => {
    renderWithProviders(<Goals />, { profile: { ...emptyFinancialProfile, onboardingCompleted: true, goals: [] } })
    expect(screen.getByText('Nenhuma meta cadastrada')).toBeInTheDocument()
  })

  it('renderiza metas existentes do perfil demo', () => {
    renderWithProviders(<Goals />)
    expect(screen.getByText('Quitar dívidas')).toBeInTheDocument()
  })

  it('adiciona nova meta ao submeter o formulário', async () => {
    renderWithProviders(<Goals />, { profile: { ...emptyFinancialProfile, onboardingCompleted: true } })
    fireEvent.change(screen.getByLabelText(/nome da meta/i), { target: { value: 'Viagem' } })
    fireEvent.change(screen.getByLabelText(/valor desejado/i), { target: { value: '10000' } })
    fireEvent.change(screen.getByLabelText(/prazo em meses/i), { target: { value: '12' } })
    fireEvent.click(screen.getByRole('button', { name: /cadastrar meta/i }))
    await waitFor(() => expect(screen.getByText('Viagem')).toBeInTheDocument())
  })

  it('exibe valor mensal necessário para a meta', () => {
    renderWithProviders(<Goals />)
    // Quitar dívidas: 5000 / 10 meses = 500/mês
    expect(screen.getByText(/10 meses/i)).toBeInTheDocument()
  })

  it('exibe erro de validação para nome curto', async () => {
    renderWithProviders(<Goals />, { profile: { ...emptyFinancialProfile, onboardingCompleted: true } })
    fireEvent.change(screen.getByLabelText(/nome da meta/i), { target: { value: 'A' } })
    fireEvent.click(screen.getByRole('button', { name: /cadastrar meta/i }))
    await waitFor(() => expect(screen.getByText(/informe o nome da meta/i)).toBeInTheDocument())
  })
})
