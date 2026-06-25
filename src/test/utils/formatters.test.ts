import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../../utils/formatters'

describe('formatCurrency', () => {
  it('formata valor positivo em BRL', () => {
    expect(formatCurrency(1000)).toContain('1.000')
    expect(formatCurrency(1000)).toContain('R$')
  })

  it('formata zero corretamente', () => {
    expect(formatCurrency(0)).toContain('0')
  })

  it('formata valor decimal', () => {
    expect(formatCurrency(1250.5)).toContain('1.250')
  })

  it('formata valor negativo', () => {
    expect(formatCurrency(-500)).toContain('500')
  })
})
