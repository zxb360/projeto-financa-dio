import type { FinancialProfile } from '../types/financial'

// Perfil padrão vazio usado quando o usuário ainda não preencheu o onboarding.
export const emptyFinancialProfile: FinancialProfile = {
  user: {
    name: '',
    profession: '',
    age: 0,
  },
  incomes: [],
  expenses: [],
  debts: [],
  assets: [],
  goals: [],
  dreams: '',
  onboardingCompleted: false,
}

// Dados de demonstração para testes ou para exibir um perfil já preenchido.
export const demoFinancialProfile: FinancialProfile = {
  user: {
    name: 'Jaeder',
    profession: 'Desenvolvedor',
    age: 32,
  },
  incomes: [
    { id: 'salary', name: 'Salário', amount: 4200 },
    { id: 'extra', name: 'Renda extra', amount: 650 },
  ],
  expenses: [
    { id: 'housing', category: 'Moradia', amount: 1350 },
    { id: 'food', category: 'Alimentação', amount: 850 },
    { id: 'transport', category: 'Transporte', amount: 420 },
    { id: 'health', category: 'Saúde', amount: 280 },
    { id: 'leisure', category: 'Lazer', amount: 260 },
  ],
  debts: [
    { id: 'credit-card', type: 'Cartão de crédito', amount: 1800, priority: 'Alta' },
    { id: 'loan', type: 'Empréstimos', amount: 3200, priority: 'Média' },
    { id: 'financing', type: 'Financiamentos', amount: 0, priority: 'Baixa' },
  ],
  assets: [
    { id: 'house', name: 'Casa', amount: 0 },
    { id: 'car', name: 'Carro', amount: 24000 },
    { id: 'motorcycle', name: 'Moto', amount: 0 },
    { id: 'investments', name: 'Investimentos', amount: 1200 },
    { id: 'emergency', name: 'Reserva de emergência', amount: 900 },
  ],
  goals: [
    { id: 'goal-1', name: 'Quitar dívidas', targetAmount: 5000, months: 10 },
  ],
  dreams: 'Quitar dívidas, investir e viajar com tranquilidade.',
  onboardingCompleted: true,
}
