import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, renderEmpty } from '../renderWithProviders'
import { Assets } from '../../pages/Assets'

beforeEach(() => localStorage.clear())

describe('Assets', () => {
  it('renderiza o título da página', () => {
    renderWithProviders(<Assets />)
    expect(screen.getByText('Patrimônio')).toBeInTheDocument()
  })

  it('exibe os ativos do perfil demo', () => {
    renderWithProviders(<Assets />)
    expect(screen.getByText('Carro')).toBeInTheDocument()
    expect(screen.getByText('Investimentos')).toBeInTheDocument()
  })

  it('exibe estado vazio quando não há ativos', () => {
    renderEmpty(<Assets />)
    expect(screen.getByText('Nenhum patrimônio cadastrado')).toBeInTheDocument()
  })
})
