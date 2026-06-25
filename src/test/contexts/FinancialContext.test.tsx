import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { FinancialProvider, useFinancial } from '../../contexts/FinancialContext'
import { emptyFinancialProfile, demoFinancialProfile } from '../../data/mockFinancialProfile'
import type { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  return <FinancialProvider>{children}</FinancialProvider>
}

beforeEach(() => {
  localStorage.clear()
})

describe('FinancialContext', () => {
  it('inicia com perfil vazio quando localStorage está vazio', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    expect(result.current.profile.onboardingCompleted).toBe(false)
    expect(result.current.profile.incomes).toHaveLength(0)
  })

  it('carrega perfil salvo no localStorage', () => {
    localStorage.setItem('fincoach-ai-profile', JSON.stringify(demoFinancialProfile))
    const { result } = renderHook(() => useFinancial(), { wrapper })
    expect(result.current.profile.user.name).toBe('Jaeder')
    expect(result.current.profile.incomes).toHaveLength(2)
  })

  it('retorna perfil vazio quando localStorage tem JSON inválido', () => {
    localStorage.setItem('fincoach-ai-profile', 'invalid-json')
    const { result } = renderHook(() => useFinancial(), { wrapper })
    expect(result.current.profile).toEqual(emptyFinancialProfile)
  })

  it('addIncome adiciona receita ao perfil', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.addIncome({ name: 'Freelance', amount: 800 })
    })
    expect(result.current.profile.incomes).toHaveLength(1)
    expect(result.current.profile.incomes[0].name).toBe('Freelance')
    expect(result.current.profile.incomes[0].amount).toBe(800)
    expect(result.current.profile.incomes[0].id).toBeDefined()
  })

  it('addIncome persiste no localStorage', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.addIncome({ name: 'Salário', amount: 3000 })
    })
    const saved = JSON.parse(localStorage.getItem('fincoach-ai-profile')!)
    expect(saved.incomes[0].name).toBe('Salário')
  })

  it('addIncome com categoria de ativo aumenta patrimônio', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.addIncome({ name: 'Aporte', category: 'Investimentos', amount: 500, affectsAssets: true })
    })
    const asset = result.current.profile.assets.find((a) => a.name.toLowerCase() === 'investimentos')
    expect(asset).toBeDefined()
    expect(asset!.amount).toBeGreaterThan(0)
  })

  it('addExpense adiciona despesa ao perfil', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.addExpense({ category: 'Moradia', amount: 1200 })
    })
    expect(result.current.profile.expenses).toHaveLength(1)
    expect(result.current.profile.expenses[0].category).toBe('Moradia')
    expect(result.current.profile.expenses[0].amount).toBe(1200)
  })

  it('addExpense persiste no localStorage', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.addExpense({ category: 'Alimentação', amount: 700 })
    })
    const saved = JSON.parse(localStorage.getItem('fincoach-ai-profile')!)
    expect(saved.expenses[0].category).toBe('Alimentação')
  })

  it('addExpense com categoria patrimonial cria ativo novo', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.addExpense({ category: 'Poupança', amount: 300, affectsAssets: true })
    })
    const asset = result.current.profile.assets.find((a) => a.name.toLowerCase() === 'poupança')
    expect(asset).toBeDefined()
    expect(asset!.amount).toBe(300)
  })

  it('addExpense com categoria patrimonial soma a ativo existente', () => {
    localStorage.setItem('fincoach-ai-profile', JSON.stringify(demoFinancialProfile))
    const { result } = renderHook(() => useFinancial(), { wrapper })
    const beforeAmount = result.current.profile.assets.find((a) => a.name === 'Investimentos')!.amount
    act(() => {
      result.current.addExpense({ category: 'Investimentos', amount: 200, affectsAssets: true })
    })
    const after = result.current.profile.assets.find((a) => a.name === 'Investimentos')!.amount
    expect(after).toBe(beforeAmount + 200)
  })

  it('addGoal adiciona meta com id gerado', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.addGoal({ name: 'Viagem', targetAmount: 5000, months: 12 })
    })
    expect(result.current.profile.goals).toHaveLength(1)
    expect(result.current.profile.goals[0].name).toBe('Viagem')
    expect(result.current.profile.goals[0].id).toBeDefined()
  })

  it('completeOnboarding marca onboardingCompleted como true', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.completeOnboarding({ ...emptyFinancialProfile, user: { name: 'Test', profession: 'Dev', age: 25 } })
    })
    expect(result.current.profile.onboardingCompleted).toBe(true)
    expect(result.current.profile.user.name).toBe('Test')
  })

  it('addImportedEntries adiciona receitas e gastos em lote', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.addImportedEntries({
        incomes: [{ name: 'Salário', amount: 3000 }],
        expenses: [{ category: 'Alimentação', amount: 500 }],
      })
    })
    expect(result.current.profile.incomes).toHaveLength(1)
    expect(result.current.profile.expenses).toHaveLength(1)
  })

  it('addImportedEntries com entrada patrimonial atualiza assets', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.addImportedEntries({
        incomes: [{ name: 'Reserva', category: 'Reserva de emergência', amount: 1000, affectsAssets: true }],
        expenses: [],
      })
    })
    const asset = result.current.profile.assets.find((a) =>
      a.name.toLowerCase().includes('reserva'),
    )
    expect(asset).toBeDefined()
  })

  it('addImportedEntries com gasto patrimonial atualiza assets', () => {
    const { result } = renderHook(() => useFinancial(), { wrapper })
    act(() => {
      result.current.addImportedEntries({
        incomes: [],
        expenses: [{ category: 'Poupança', amount: 400, affectsAssets: true }],
      })
    })
    const asset = result.current.profile.assets.find((a) => a.name.toLowerCase() === 'poupança')
    expect(asset!.amount).toBe(400)
  })

  it('lança erro quando useFinancial é usado fora do provider', () => {
    expect(() => renderHook(() => useFinancial())).toThrow(
      'useFinancial deve ser usado dentro de FinancialProvider',
    )
  })
})
