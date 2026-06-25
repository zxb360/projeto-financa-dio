import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Banknote } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { StatCard } from '../../components/StatCard'

describe('PageHeader', () => {
  it('renderiza título e descrição', () => {
    render(<PageHeader title="Receitas" description="Suas fontes de renda" />)
    expect(screen.getByText('Receitas')).toBeInTheDocument()
    expect(screen.getByText('Suas fontes de renda')).toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('renderiza título e descrição', () => {
    render(<EmptyState icon={Banknote} title="Sem dados" description="Adicione itens para começar" />)
    expect(screen.getByText('Sem dados')).toBeInTheDocument()
    expect(screen.getByText('Adicione itens para começar')).toBeInTheDocument()
  })
})

describe('StatCard', () => {
  it('renderiza título, valor e helper', () => {
    render(<StatCard title="Score" value="85/100" helper="Cálculo fictício" icon={Banknote} />)
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('85/100')).toBeInTheDocument()
    expect(screen.getByText('Cálculo fictício')).toBeInTheDocument()
  })
})
