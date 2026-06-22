import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useState, type InputHTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useFinancial } from '../contexts/FinancialContext'
import type { FinancialProfile } from '../types/financial'

// Validação do formulário de onboarding usando Zod.
// Cada campo é validado para garantir que o usuário insira dados mínimos aceitáveis.
const onboardingSchema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  profession: z.string().min(2, 'Informe sua profissão'),
  age: z.coerce.number().int().min(16, 'Informe uma idade válida'),
  salary: z.coerce.number().min(0),
  extraIncome: z.coerce.number().min(0),
  housing: z.coerce.number().min(0),
  food: z.coerce.number().min(0),
  transport: z.coerce.number().min(0),
  health: z.coerce.number().min(0),
  leisure: z.coerce.number().min(0),
  creditCard: z.coerce.number().min(0),
  loans: z.coerce.number().min(0),
  financing: z.coerce.number().min(0),
  house: z.coerce.number().min(0),
  car: z.coerce.number().min(0),
  motorcycle: z.coerce.number().min(0),
  investments: z.coerce.number().min(0),
  emergencyReserve: z.coerce.number().min(0),
  dreams: z.string().min(6, 'Conte pelo menos um objetivo'),
})

type OnboardingData = z.infer<typeof onboardingSchema>
type OnboardingInput = z.input<typeof onboardingSchema>

const steps = ['Dados pessoais', 'Receitas', 'Despesas', 'Dívidas', 'Patrimônio', 'Sonhos']

export function Onboarding() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const { completeOnboarding } = useFinancial()
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<OnboardingInput, unknown, OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      salary: 0,
      extraIncome: 0,
      housing: 0,
      food: 0,
      transport: 0,
      health: 0,
      leisure: 0,
      creditCard: 0,
      loans: 0,
      financing: 0,
      house: 0,
      car: 0,
      motorcycle: 0,
      investments: 0,
      emergencyReserve: 0,
    },
  })

  // Avança para a próxima etapa do onboarding apenas se os campos atuais forem válidos.
  async function nextStep() {
    const fieldsByStep: Array<Array<keyof OnboardingInput>> = [
      ['name', 'profession', 'age'],
      ['salary', 'extraIncome'],
      ['housing', 'food', 'transport', 'health', 'leisure'],
      ['creditCard', 'loans', 'financing'],
      ['house', 'car', 'motorcycle', 'investments', 'emergencyReserve'],
      ['dreams'],
    ]

    const valid = await trigger(fieldsByStep[step])
    if (valid) {
      setStep((currentStep) => Math.min(currentStep + 1, steps.length - 1))
    }
  }

  // Constrói o perfil financeiro a partir dos valores do formulário e finaliza o onboarding.
  function onSubmit(data: OnboardingData) {
    const profile: FinancialProfile = {
      user: { name: data.name, profession: data.profession, age: data.age },
      incomes: [
        { id: 'salary', name: 'Salário', amount: data.salary },
        { id: 'extra-income', name: 'Renda extra', amount: data.extraIncome },
      ],
      expenses: [
        { id: 'housing', category: 'Moradia', amount: data.housing },
        { id: 'food', category: 'Alimentação', amount: data.food },
        { id: 'transport', category: 'Transporte', amount: data.transport },
        { id: 'health', category: 'Saúde', amount: data.health },
        { id: 'leisure', category: 'Lazer', amount: data.leisure },
      ],
      debts: [
        { id: 'credit-card', type: 'Cartão de crédito', amount: data.creditCard, priority: 'Alta' },
        { id: 'loans', type: 'Empréstimos', amount: data.loans, priority: 'Média' },
        { id: 'financing', type: 'Financiamentos', amount: data.financing, priority: 'Baixa' },
      ],
      assets: [
        { id: 'house', name: 'Casa', amount: data.house },
        { id: 'car', name: 'Carro', amount: data.car },
        { id: 'motorcycle', name: 'Moto', amount: data.motorcycle },
        { id: 'investments', name: 'Investimentos', amount: data.investments },
        { id: 'emergency', name: 'Reserva de emergência', amount: data.emergencyReserve },
      ],
      goals: [],
      dreams: data.dreams,
      onboardingCompleted: true,
    }

    completeOnboarding(profile)
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">FinCoach AI</p>
          <h1 className="mt-2 text-3xl font-bold">Vamos entender sua vida financeira</h1>
          <p className="mt-2 text-slate-600">Preencha as etapas abaixo para montar seu dashboard inicial.</p>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2 md:grid-cols-6">
          {steps.map((label, index) => (
            <div key={label} className={`rounded-lg px-3 py-2 text-center text-xs font-bold ${index <= step ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500'}`}>
              {index + 1}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <h2 className="mb-5 text-xl font-bold">{steps[step]}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {step === 0 && (
              <>
                <Input label="Nome" error={errors.name?.message} {...register('name')} />
                <Input label="Profissão" error={errors.profession?.message} {...register('profession')} />
                <Input label="Idade" type="number" error={errors.age?.message} {...register('age')} />
              </>
            )}
            {step === 1 && (
              <>
                <Input label="Salário" type="number" {...register('salary')} />
                <Input label="Renda extra" type="number" {...register('extraIncome')} />
              </>
            )}
            {step === 2 && (
              <>
                <Input label="Moradia" type="number" {...register('housing')} />
                <Input label="Alimentação" type="number" {...register('food')} />
                <Input label="Transporte" type="number" {...register('transport')} />
                <Input label="Saúde" type="number" {...register('health')} />
                <Input label="Lazer" type="number" {...register('leisure')} />
              </>
            )}
            {step === 3 && (
              <>
                <Input label="Cartão de crédito" type="number" {...register('creditCard')} />
                <Input label="Empréstimos" type="number" {...register('loans')} />
                <Input label="Financiamentos" type="number" {...register('financing')} />
              </>
            )}
            {step === 4 && (
              <>
                <Input label="Casa" type="number" {...register('house')} />
                <Input label="Carro" type="number" {...register('car')} />
                <Input label="Moto" type="number" {...register('motorcycle')} />
                <Input label="Investimentos" type="number" {...register('investments')} />
                <Input label="Reserva de emergência" type="number" {...register('emergencyReserve')} />
              </>
            )}
            {step === 5 && (
              <label className="md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Sonhos e objetivos</span>
                <textarea className="mt-1 min-h-36 w-full rounded-lg border border-slate-300 px-3 py-2" {...register('dreams')} />
                {errors.dreams && <p className="mt-1 text-sm text-rose-600">{errors.dreams.message}</p>}
              </label>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((currentStep) => Math.max(currentStep - 1, 0))}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={nextStep} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">
                Avançar
                <ArrowRight size={18} />
              </button>
            ) : (
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">
                Concluir
                <Check size={18} />
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

// Componente reutilizável de campo de entrada com suporte a erro.
function Input({ label, error, ...props }: InputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" {...props} />
      {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
    </label>
  )
}
