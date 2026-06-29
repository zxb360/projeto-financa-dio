import { Loader2 } from 'lucide-react'

interface LoaderCircleProps {
  size?: number
  className?: string
  label?: string
}

// Spinner acessível reutilizável para estados de carregamento.
export function LoaderCircle({ size = 18, className = '', label = 'Carregando...' }: LoaderCircleProps) {
  return (
    <span role="status" aria-live="polite" className={`inline-flex items-center ${className}`}>
      <Loader2 size={size} className="animate-spin" />
      <span className="sr-only">{label}</span>
    </span>
  )
}
