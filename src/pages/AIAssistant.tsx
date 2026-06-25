import { FileText, Loader2, Mic, Send, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useFinancial } from '../contexts/FinancialContext'
import { analyzeFinancialProfile, parseBankStatement } from '../services/aiAssistant'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string | undefined
}

// Tipos mínimos para usar a Web Speech API sem instalar dependências extras.
// Alguns navegadores expõem a API como SpeechRecognition, outros como webkitSpeechRecognition.
interface SpeechRecognitionResultEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
  }
}

interface SpeechRecognitionConstructor {
  new (): {
    lang: string
    interimResults: boolean
    onresult: (event: SpeechRecognitionResultEvent) => void
    start: () => void
  }
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

// Página que simula um assistente financeiro baseado nas perguntas do usuário.
export function AIAssistant() {
  const { profile, addImportedEntries } = useFinancial()
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Posso ajudar você a entender prioridades, dívidas, metas e próximos passos financeiros.',
    },
  ])

  // Envia uma pergunta digitada pelo usuário para a IA e adiciona a resposta no histórico.
  // O estado isLoading evita cliques repetidos enquanto a chamada assíncrona está em andamento.
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!question.trim() || isLoading) {
      return
    }

    setIsLoading(true)
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: question }
    setMessages((currentMessages) => [...currentMessages, userMessage])
    setQuestion('')

    try {
      const answer: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: await analyzeFinancialProfile(question, profile),
      }
      setMessages((currentMessages) => [...currentMessages, answer])
    } finally {
      setIsLoading(false)
    }
  }

  // Fluxo de importação de extrato:
  // 1. O usuário escolhe um arquivo PDF, CSV ou TXT.
  // 2. O serviço de IA transforma as linhas do extrato em receitas e gastos estruturados.
  // 3. O contexto financeiro salva as movimentações e atualiza patrimônio quando necessário.
  async function handleStatementUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file || isImporting) {
      return
    }

    setIsImporting(true)
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: `Anexei o extrato: ${file.name}`,
      },
    ])

    try {
      const entries = await parseBankStatement(file)
      addImportedEntries(entries)
      const totalEntries = entries.incomes.length + entries.expenses.length

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            totalEntries > 0
              ? `Importei ${totalEntries} movimentações do extrato: ${entries.incomes.length} receitas e ${entries.expenses.length} gastos. Itens de investimento, poupança, consórcio, bens e reserva também foram somados ao patrimônio.`
              : 'Li o arquivo, mas não encontrei movimentações financeiras claras para importar.',
        },
      ])
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Não consegui importar esse extrato. Envie um arquivo em PDF, CSV ou TXT com data, descrição e valor. Detalhe: ${error}`,
        },
      ])
    } finally {
      setIsImporting(false)
      event.target.value = ''
    }
  }

  // Ativa ditado por voz no navegador.
  // O texto reconhecido preenche o input; o usuário ainda pode revisar antes de enviar.
  function handleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Seu navegador não oferece suporte a ditado por voz nesta tela.',
        },
      ])
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.interimResults = false
    recognition.onresult = (event) => {
      setQuestion(event.results[0][0].transcript)
    }
    recognition.start()
  }

  return (
    <>
      <PageHeader title="Assistente IA" description="Faça perguntas e receba orientações simuladas com base no seu perfil financeiro." />
      <section className="flex min-h-\[620px\] flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
          <input ref={fileInputRef} type="file" accept=".pdf,.csv,.txt,application/pdf,text/csv,text/plain" className="hidden" onChange={handleStatementUpload} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {isImporting ? 'Importando...' : 'Anexar extrato'}
          </button>
          <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <FileText size={16} />
            Anexe arquivos de extrato bancarios para registrar suas movimentações financeiras em formato 
            PDF, CSV ou TXT e veja a magia acontecer.
          </span>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <p
                className={`max-w-[82%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                {message.content}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3 border-t border-slate-200 p-4 dark:border-slate-800">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Pergunte sobre dívidas, metas ou gastos"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleVoiceInput}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Ditado por voz"
            title="Ditado por voz"
          >
            <Mic size={18} />
          </button>
          <button
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            {isLoading ? 'Aguarde...' : 'Enviar'}
          </button>
        </form>
      </section>
    </>
  )
}
