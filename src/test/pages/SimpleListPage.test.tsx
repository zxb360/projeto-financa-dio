import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Banknote } from 'lucide-react'
import { SimpleListPage } from '../../pages/SimpleListPage'

const items = [
  { id: '1', label: 'Salário', value: 4200 },
  { id: '2', label: 'Freelance', value: 800 },
]

describe('SimpleListPage', () => {
  it('renderiza estado vazio quando não há itens', () => {
    render(
      <SimpleListPage
        title="Receitas"
        description="Descrição"
        items={[]}
        emptyTitle="Nenhuma receita"
        emptyDescription="Adicione receitas"
        icon={Banknote}
      />,
    )
    expect(screen.getByText('Nenhuma receita')).toBeInTheDocument()
    expect(screen.getByText('Adicione receitas')).toBeInTheDocument()
  })

  it('renderiza lista de itens quando há dados', () => {
    render(
      <SimpleListPage
        title="Receitas"
        description="Descrição"
        items={items}
        emptyTitle="Nenhuma receita"
        emptyDescription="Adicione receitas"
        icon={Banknote}
      />,
    )
    expect(screen.getByText('Salário')).toBeInTheDocument()
    expect(screen.getByText('Freelance')).toBeInTheDocument()
  })

  it('renderiza o título da página', () => {
    render(
      <SimpleListPage
        title="Patrimônio"
        description="Seus ativos"
        items={items}
        emptyTitle="Vazio"
        emptyDescription="Sem dados"
        icon={Banknote}
      />,
    )
    expect(screen.getByText('Patrimônio')).toBeInTheDocument()
  })
})
