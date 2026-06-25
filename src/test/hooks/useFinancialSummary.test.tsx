import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { FinancialProvider } from '../../contexts/FinancialContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { useFinancialSummary } from '../../hooks/useFinancialSummary'
import { demoFinancialProfile, emptyFinancialProfile } from '../../data/mockFinancialProfile'
import type { ReactNode } from 'react'

function makeWrapper(profile = demoFinancialProfile) {
  localStorage.setItem('fincoach-ai-profile', JSON.stringify(profile))
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider>
        <FinancialProvider>{children}</FinancialProvider>
      </ThemeProvider>
    )
  }
}

beforeEach(() => localStorage.clear())

describe('useFinancialSummary', () => {
  it('calcula totalIncome corretamente', () => {
    const { result } = renderHook(() => useFinancialSummary(), { wrapper: makeWrapper() })
    // demoProfile: 4200 + 650 = 4850
    expect(result.current.totalIncome).toBe(4850)
  })

  it('calcula totalExpenses corretamente', () => {
    const { result } = renderHook(() => useFinancialSummary(), { wrapper: makeWrapper() })
    // 1350 + 850 + 420 + 280 + 260 = 3160
    expect(result.current.totalExpenses).toBe(3160)
  })

  it('calcula totalDebts corretamente', () => {
    const { result } = renderHook(() => useFinancialSummary(), { wrapper: makeWrapper() })
    // 1800 + 3200 + 0 = 5000
    expect(result.current.totalDebts).toBe(5000)
  })

  it('calcula totalAssets corretamente', () => {
    const { result } = renderHook(() => useFinancialSummary(), { wrapper: makeWrapper() })
    // 0 + 24000 + 0 + 1200 + 900 = 26100
    expect(result.current.totalAssets).toBe(26100)
  })

  it('calcula netWorth como assets - debts', () => {
    const { result } = renderHook(() => useFinancialSummary(), { wrapper: makeWrapper() })
    expect(result.current.netWorth).toBe(26100 - 5000)
  })

  it('score fica entre 0 e 100', () => {
    const { result } = renderHook(() => useFinancialSummary(), { wrapper: makeWrapper() })
    expect(result.current.score).toBeGreaterThanOrEqual(0)
    expect(result.current.score).toBeLessThanOrEqual(100)
  })

  it('retorna zeros com perfil vazio', () => {
    const { result } = renderHook(() => useFinancialSummary(), { wrapper: makeWrapper(emptyFinancialProfile) })
    expect(result.current.totalIncome).toBe(0)
    expect(result.current.totalExpenses).toBe(0)
    expect(result.current.totalDebts).toBe(0)
    expect(result.current.totalAssets).toBe(0)
    expect(result.current.netWorth).toBe(0)
  })

  it('expenseRatio é 1 quando totalIncome é zero (sem divisão por zero)', () => {
    const { result } = renderHook(() => useFinancialSummary(), { wrapper: makeWrapper(emptyFinancialProfile) })
    // score com expenseRatio=1 e debtRatio=1: 78 - 28 - 22 = 28
    expect(result.current.score).toBe(28)
  })

  it('aplica reserveBonus quando existe ativo "Reserva"', () => {
    const profileWithReserve = {
      ...emptyFinancialProfile,
      assets: [{ id: 'r', name: 'Reserva de emergência', amount: 1000 }],
    }
    const { result } = renderHook(() => useFinancialSummary(), { wrapper: makeWrapper(profileWithReserve) })
    // Com reserva: 78 - 28 - 22 + 12 = 40
    expect(result.current.score).toBe(40)
  })
})
