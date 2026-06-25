import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext'
import type { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('ThemeContext', () => {
  it('inicia com tema light por padrão', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('light')
  })

  it('carrega tema salvo no localStorage', () => {
    localStorage.setItem('fincoach-ai-theme', 'dark')
    const { result } = renderHook(() => useTheme(), { wrapper })
    expect(result.current.theme).toBe('dark')
  })

  it('toggleTheme alterna de light para dark', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => { result.current.toggleTheme() })
    expect(result.current.theme).toBe('dark')
  })

  it('toggleTheme alterna de dark para light', () => {
    localStorage.setItem('fincoach-ai-theme', 'dark')
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => { result.current.toggleTheme() })
    expect(result.current.theme).toBe('light')
  })

  it('persiste o tema no localStorage após toggle', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => { result.current.toggleTheme() })
    expect(localStorage.getItem('fincoach-ai-theme')).toBe('dark')
  })

  it('adiciona classe dark no documentElement quando tema é dark', () => {
    localStorage.setItem('fincoach-ai-theme', 'dark')
    renderHook(() => useTheme(), { wrapper })
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('lança erro quando useTheme é usado fora do provider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme deve ser usado dentro de ThemeProvider',
    )
  })
})
