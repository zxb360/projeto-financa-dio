import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderEmpty } from '../renderWithProviders'
import { Onboarding } from '../../pages/Onboarding'

beforeEach(() => localStorage.clear())

describe('Onboarding', () => {
  it('renderiza o título principal', () => {
    renderEmpty(<Onboarding />)
    expect(screen.getByText(/vamos entender sua vida financeira/i)).toBeInTheDocument()
  })

  it('começa no step Dados pessoais', () => {
    renderEmpty(<Onboarding />)
    expect(screen.getByText('Dados pessoais')).toBeInTheDocument()
  })

  it('exibe campo de nome no step 0', () => {
    renderEmpty(<Onboarding />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
  })

  it('exibe campo de profissão no step 0', () => {
    renderEmpty(<Onboarding />)
    expect(screen.getByLabelText(/profissão/i)).toBeInTheDocument()
  })

  it('botão Voltar está desabilitado no step 0', () => {
    renderEmpty(<Onboarding />)
    expect(screen.getByRole('button', { name: /voltar/i })).toBeDisabled()
  })

  it('avança para step Receitas ao preencher dados pessoais válidos', async () => {
    renderEmpty(<Onboarding />)
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Ana Silva' } })
    fireEvent.change(screen.getByLabelText(/profissão/i), { target: { value: 'Engenheira' } })
    fireEvent.change(screen.getByLabelText(/idade/i), { target: { value: '28' } })
    fireEvent.click(screen.getByRole('button', { name: /avançar/i }))
    await waitFor(() => expect(screen.getByText('Receitas')).toBeInTheDocument())
  })

  it('não avança se nome estiver inválido', async () => {
    renderEmpty(<Onboarding />)
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Ana' } })
    fireEvent.click(screen.getByRole('button', { name: /avançar/i }))
    await waitFor(() => expect(screen.getByText('Dados pessoais')).toBeInTheDocument())
  })

  it('volta para step anterior ao clicar em Voltar', async () => {
    renderEmpty(<Onboarding />)
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Ana Silva' } })
    fireEvent.change(screen.getByLabelText(/profissão/i), { target: { value: 'Engenheira' } })
    fireEvent.change(screen.getByLabelText(/idade/i), { target: { value: '28' } })
    fireEvent.click(screen.getByRole('button', { name: /avançar/i }))
    await waitFor(() => expect(screen.getByText('Receitas')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }))
    await waitFor(() => expect(screen.getByText('Dados pessoais')).toBeInTheDocument())
  })

  it('exibe botão Concluir no último step', async () => {
    renderEmpty(<Onboarding />)
    const steps = [
      { label: /nome/i, value: 'Ana Silva' },
    ]
    // Navega rapidamente até o último step preenchendo cada etapa
    const goNext = async (fields: { label: RegExp | string; value: string }[]) => {
      for (const f of fields) {
        fireEvent.change(screen.getByLabelText(f.label), { target: { value: f.value } })
      }
      fireEvent.click(screen.getByRole('button', { name: /avançar/i }))
    }
    await goNext([{ label: /nome/i, value: 'Ana Silva' }, { label: /profissão/i, value: 'Eng' }, { label: /idade/i, value: '25' }])
    await waitFor(() => expect(screen.getByText('Receitas')).toBeInTheDocument())
    await goNext([{ label: /salário/i, value: '3000' }, { label: /renda extra/i, value: '500' }])
    await waitFor(() => expect(screen.getByText('Despesas')).toBeInTheDocument())
    await goNext([{ label: /moradia/i, value: '1000' }, { label: /alimentação/i, value: '500' }, { label: /transporte/i, value: '200' }, { label: /saúde/i, value: '100' }, { label: /lazer/i, value: '100' }])
    await waitFor(() => expect(screen.getByText('Dívidas')).toBeInTheDocument())
    await goNext([{ label: /cartão/i, value: '500' }, { label: /empréstimos/i, value: '1000' }, { label: /financiamentos/i, value: '0' }])
    await waitFor(() => expect(screen.getByText('Patrimônio')).toBeInTheDocument())
    await goNext([{ label: /casa/i, value: '0' }, { label: /carro/i, value: '20000' }, { label: /moto/i, value: '0' }, { label: /investimentos/i, value: '1000' }, { label: /reserva/i, value: '500' }])
    await waitFor(() => expect(screen.getByRole('button', { name: /concluir/i })).toBeInTheDocument())
  })
})
