// Dados do usuário que são usados em todo o perfil financeiro.
export interface User {
  name: string
  profession: string
  age: number
}

// Fonte de receita mensal do usuário.
export interface Income {
  id: string
  name: string
  amount: number
}

// Categoria de gasto mensal do usuário.
export interface Expense {
  id: string
  category: string
  amount: number
}

// Dívida do usuário com prioridade de pagamento.
export interface Debt {
  id: string
  type: string
  amount: number
  priority: 'Alta' | 'Média' | 'Baixa'
}

// Ativo que compõe o patrimônio do usuário.
export interface Asset {
  id: string
  name: string
  amount: number
}

// Meta financeira que o usuário deseja alcançar.
export interface Goal {
  id: string
  name: string
  targetAmount: number
  months: number
}

// Estrutura completa do perfil financeiro que o aplicativo gerencia.
export interface FinancialProfile {
  user: User
  incomes: Income[]
  expenses: Expense[]
  debts: Debt[]
  assets: Asset[]
  goals: Goal[]
  dreams: string
  onboardingCompleted: boolean
}
