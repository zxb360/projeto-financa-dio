import { Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useFinancial } from '../contexts/FinancialContext'
import { analyzeFinancialProfile } from '../services/aiAssistant'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

// Página que simula um assistente financeiro baseado nas perguntas do usuário.
export function AIAssistant() {
  const { profile } = useFinancial()
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Posso ajudar você a entender prioridades, dívidas, metas e próximos passos financeiros.',
    },
  ])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!question.trim()) {
      return
    }

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: question }
    const answer: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: analyzeFinancialProfile(question, profile),
    }

    setMessages((currentMessages) => [...currentMessages, userMessage, answer])
    setQuestion('')
  }

  return (
    <>
      <PageHeader title="Assistente IA" description="Faça perguntas e receba orientações simuladas com base no seu perfil financeiro." />
      <section className="flex min-h-[620px] flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <p
                className={`max-w-[82%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800'
                }`}
              >
                {message.content}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3 border-t border-slate-200 p-4">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3"
            placeholder="Pergunte sobre dívidas, metas ou gastos"
          />
          <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700" type="submit">
            <Send size={18} />
            Enviar
          </button>
        </form>
      </section>
    </>
  )
}
