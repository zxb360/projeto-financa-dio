import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoaderCircle } from '../../components/LoaderCircle'

describe('LoaderCircle', () => {
  it('renderiza um spinner acessível', () => {
    render(<LoaderCircle size={20} label="Carregando dados" />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Carregando dados')).toBeInTheDocument()
  })
})
