import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { analyzeFinancialProfile } from '../../services/aiAssistant'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

describe('aiAssistant service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_AI_API_URL', 'https://api.example.com/assistente-ai')
  })

  it('envia a requisição para o endpoint configurado da API do assistente', async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        candidates: [{ content: { parts: [{ text: 'Resposta de teste' }] } }],
      },
    } as never)

    await analyzeFinancialProfile('Como estou?', {
      user: {
        name: 'Ana',
        age: 30,
        profession: 'Designer',
      },
      incomes: [],
      expenses: [],
      debts: [],
      assets: [],
      dreams: 'Viajar',
    } as any)

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.example.com/assistente-ai',
      expect.objectContaining({
        contents: expect.any(Array),
      }),
    )
  })
})
