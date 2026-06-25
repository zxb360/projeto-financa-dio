import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FinancialProvider } from '../contexts/FinancialContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import type { FinancialProfile } from '../types/financial'
import { demoFinancialProfile, emptyFinancialProfile } from '../data/mockFinancialProfile'
import type { ReactNode } from 'react'

interface WrapperOptions {
  profile?: Partial<FinancialProfile>
  initialEntries?: string[]
}

export function renderWithProviders(
  ui: ReactNode,
  { profile, initialEntries = ['/'] }: WrapperOptions = {},
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  const mergedProfile = profile
    ? { ...demoFinancialProfile, ...profile }
    : demoFinancialProfile

  // Injeta o perfil no localStorage antes de renderizar
  localStorage.setItem('fincoach-ai-profile', JSON.stringify(mergedProfile))

  return render(
    <ThemeProvider>
      <FinancialProvider>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </FinancialProvider>
    </ThemeProvider>,
    options,
  )
}

export function renderEmpty(ui: ReactNode, options?: WrapperOptions) {
  return renderWithProviders(ui, { profile: emptyFinancialProfile, ...options })
}

export { demoFinancialProfile, emptyFinancialProfile }
