import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { emptyFinancialProfile } from '../data/mockFinancialProfile'
import type { FinancialProfile, Goal } from '../types/financial'

/* eslint-disable react-refresh/only-export-components */

// Tipos usados no contexto financeiro.
interface FinancialContextValue {
  profile: FinancialProfile
  completeOnboarding: (profile: FinancialProfile) => void
  addGoal: (goal: Omit<Goal, 'id'>) => void
}

// Chave usada para salvar o perfil no localStorage do navegador.
const STORAGE_KEY = 'fincoach-ai-profile'
const FinancialContext = createContext<FinancialContextValue | undefined>(undefined)

// Carrega o perfil do localStorage. Se não existir ou estiver inválido, retorna o perfil vazio.
function loadProfile() {
  const storedProfile = localStorage.getItem(STORAGE_KEY)

  if (!storedProfile) {
    return emptyFinancialProfile
  }

  try {
    return JSON.parse(storedProfile) as FinancialProfile
  } catch {
    return emptyFinancialProfile
  }
}

export function FinancialProvider({ children }: { children: ReactNode }) {
  // Inicializa o estado com o perfil carregado do localStorage.
  const [profile, setProfile] = useState<FinancialProfile>(() => loadProfile())

  // Sempre que o perfil mudar, atualiza o localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const value = useMemo<FinancialContextValue>(
    () => ({
      profile,
      completeOnboarding: (nextProfile) => {
        setProfile({ ...nextProfile, onboardingCompleted: true })
      },
      addGoal: (goal) => {
        setProfile((currentProfile) => ({
          ...currentProfile,
          goals: [...currentProfile.goals, { ...goal, id: crypto.randomUUID() }],
        }))
      },
    }),
    [profile],
  )

  return <FinancialContext.Provider value={value}>{children}</FinancialContext.Provider>
}

// Hook personalizado para acessar o contexto financeiro de forma segura.
export function useFinancial() {
  const context = useContext(FinancialContext)

  if (!context) {
    throw new Error('useFinancial deve ser usado dentro de FinancialProvider')
  }

  return context
}
