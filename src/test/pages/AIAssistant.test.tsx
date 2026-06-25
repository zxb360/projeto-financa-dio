import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../renderWithProviders'
import { AIAssistant } from '../../pages/AIAssistant'

// Mock do serviço de IA para não fazer chamadas reais
vi.mock('../../services/aiAssistant', () => ({
  analyzeFinancialProfile: vi.fn().mockResolvedValue('Sua situação financeira está boa!'),
}))

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

describe('AIAssistant', () => {
  it('renderiza o título da página', () => {
    renderWithProviders(<AIAssistant />)
    expect(screen.getByText('Assistente IA')).toBeInTheDocument()
  })

  it('exibe mensagem de boas-vindas inicial', () => {
    renderWithProviders(<AIAssistant />)
    expect(screen.getByText(/Olá! Posso ajudar/i)).toBeInTheDocument()
  })

  it('renderiza o campo de input', () => {
    renderWithProviders(<AIAssistant />)
    expect(screen.getByPlaceholderText(/pergunte sobre dívidas/i)).toBeInTheDocument()
  })

  it('renderiza o botão de enviar', () => {
    renderWithProviders(<AIAssistant />)
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
  })

  it('exibe a mensagem do usuário ao enviar', async () => {
    renderWithProviders(<AIAssistant />)
    const input = screen.getByPlaceholderText(/pergunte sobre dívidas/i)
    fireEvent.change(input, { target: { value: 'Como estão minhas finanças?' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => expect(screen.getByText('Como estão minhas finanças?')).toBeInTheDocument())
  })

  it('exibe a resposta da IA após envio', async () => {
    renderWithProviders(<AIAssistant />)
    const input = screen.getByPlaceholderText(/pergunte sobre dívidas/i)
    fireEvent.change(input, { target: { value: 'Análise geral' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => expect(screen.getByText('Sua situação financeira está boa!')).toBeInTheDocument())
  })

  it('limpa o input após enviar a pergunta', async () => {
    renderWithProviders(<AIAssistant />)
    const input = screen.getByPlaceholderText(/pergunte sobre dívidas/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Minha pergunta' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    await waitFor(() => expect(input.value).toBe(''))
  })

  it('não envia pergunta vazia', async () => {
    const mod = await import('../../services/aiAssistant')
    const spy = vi.spyOn(mod, 'analyzeFinancialProfile')
    renderWithProviders(<AIAssistant />)
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    expect(spy).not.toHaveBeenCalled()
  })
})
