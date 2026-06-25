import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isAssetCategory } from '../data/financialCategories'
import { emptyFinancialProfile } from '../data/mockFinancialProfile'
import type { Expense, FinancialProfile, Goal, Income } from '../types/financial'

/* eslint-disable react-refresh/only-export-components */

// Tipos usados no contexto financeiro.
interface FinancialContextValue {
  profile: FinancialProfile
  completeOnboarding: (profile: FinancialProfile) => void
  addGoal: (goal: Omit<Goal, 'id'>) => void
  addIncome: (income: Omit<Income, 'id'>) => void
  addExpense: (expense: Omit<Expense, 'id'>) => void
  addImportedEntries: (entries: { incomes: Array<Omit<Income, 'id'>>; expenses: Array<Omit<Expense, 'id'>> }) => void
}

// Chave usada para salvar o perfil no localStorage do navegador.
const STORAGE_KEY = 'fincoach-ai-profile'
const FinancialContext = createContext<FinancialContextValue | undefined>(undefined)

// Atualiza a lista de ativos sempre que uma movimentação financeira representa patrimônio.
// A função mantém a regra concentrada no contexto, evitando que telas diferentes
// precisem repetir a mesma lógica ao adicionar receitas, gastos ou itens importados por IA.
function applyAssetImpact(profile: FinancialProfile, category: string, amount: number, operation: 'increase' | 'decrease') {
  if (!isAssetCategory(category)) {
    return profile.assets
  }

  // Caso o ativo já exista, apenas soma/subtrai o valor no registro atual.
  // O Math.max impede que uma eventual subtração deixe um patrimônio negativo.
  const multiplier = operation === 'increase' ? 1 : -1
  const existingAsset = profile.assets.find((asset) => asset.name.toLowerCase() === category.toLowerCase())

  if (existingAsset) {
    return profile.assets.map((asset) =>
      asset.id === existingAsset.id ? { ...asset, amount: Math.max(0, asset.amount + amount * multiplier) } : asset,
    )
  }

  // Se ainda não existir ativo para aquela categoria, cria um novo item automaticamente.
  // Isso permite que "Poupança", "Consórcio" ou "Bens" apareçam no patrimônio
  // sem exigir que o usuário cadastre manualmente antes.
  return [
    ...profile.assets,
    {
      id: crypto.randomUUID(),
      name: category,
      amount: operation === 'increase' ? amount : 0,
    },
  ]
}

// Respeita uma marca explícita vinda do formulário ou da IA.
// Se ela não existir, usa a própria categoria para decidir se mexe no patrimônio.
function shouldAffectAssets(entry: { category?: string; affectsAssets?: boolean }) {
  return Boolean(entry.affectsAssets ?? (entry.category && isAssetCategory(entry.category)))
}

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
      addIncome: (income) => {
        setProfile((currentProfile) => ({
          ...currentProfile,
          incomes: [...currentProfile.incomes, { ...income, id: crypto.randomUUID() }],
          // Receitas patrimoniais, como venda de bem ou rendimento de investimento,
          // também podem elevar o patrimônio quando marcadas com categoria compatível.
          assets: shouldAffectAssets(income)
            ? applyAssetImpact(currentProfile, income.category ?? income.name, income.amount, 'increase')
            : currentProfile.assets,
        }))
      },
      addExpense: (expense) => {
        setProfile((currentProfile) => ({
          ...currentProfile,
          expenses: [...currentProfile.expenses, { ...expense, id: crypto.randomUUID() }],
          // Um gasto classificado como investimento, poupança, consórcio ou bem
          // é uma saída no mês, mas também vira ativo patrimonial.
          assets: shouldAffectAssets(expense)
            ? applyAssetImpact(currentProfile, expense.category, expense.amount, 'increase')
            : currentProfile.assets,
        }))
      },
      addImportedEntries: (entries) => {
        setProfile((currentProfile) => {
          // A importação por IA pode trazer várias linhas de uma vez.
          // Cada item recebe um id local antes de entrar no estado persistido.
          const incomes = entries.incomes.map((income) => ({ ...income, id: crypto.randomUUID() }))
          const expenses = entries.expenses.map((expense) => ({ ...expense, id: crypto.randomUUID() }))
          // Primeiro aplica impactos patrimoniais das receitas importadas.
          const assetsWithIncomes = entries.incomes.reduce(
            (assets, income) =>
              shouldAffectAssets(income)
                ? applyAssetImpact({ ...currentProfile, assets }, income.category ?? income.name, income.amount, 'increase')
                : assets,
            currentProfile.assets,
          )
          // Depois aplica impactos patrimoniais dos gastos importados.
          // O segundo reduce usa o resultado do primeiro para não perder nenhuma soma.
          const assets = entries.expenses.reduce(
            (currentAssets, expense) =>
              shouldAffectAssets(expense)
                ? applyAssetImpact({ ...currentProfile, assets: currentAssets }, expense.category, expense.amount, 'increase')
                : currentAssets,
            assetsWithIncomes,
          )

          return {
            ...currentProfile,
            incomes: [...currentProfile.incomes, ...incomes],
            expenses: [...currentProfile.expenses, ...expenses],
            assets,
          }
        })
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
