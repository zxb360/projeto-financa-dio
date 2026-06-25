// Categorias usadas no formulário de receitas.
// Elas ajudam a padronizar os dados para gráficos, filtros e análises futuras da IA.
export const incomeCategories = [
  'Salário',
  'Renda extra',
  'Investimentos',
  'Rendimentos',
  'Venda de bem',
  'Aluguel recebido',
  'Reembolso',
  'Outros',
]

// Categorias usadas no formulário de gastos.
// A lista mistura despesas comuns e itens que podem representar formação de patrimônio.
export const expenseCategories = [
  'Moradia',
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Cartão de crédito',
  'Empréstimos',
  'Investimentos',
  'Poupança',
  'Consórcio',
  'Bens',
  'Reserva de emergência',
  'Outros',
]

// Categorias patrimoniais são tratadas de forma especial:
// quando uma receita ou gasto entra com uma delas, o valor também aumenta o patrimônio.
// Exemplo: registrar um gasto em "Investimentos" reduz o caixa do mês,
// mas aumenta o ativo "Investimentos" na aba de patrimônio.
export const assetCategories = [
  'Investimentos',
  'Poupança',
  'Consórcio',
  'Bens',
  'Reserva de emergência',
]

// Compara ignorando maiúsculas/minúsculas para evitar duplicidade por digitação diferente.
export function isAssetCategory(category: string) {
  return assetCategories.some((assetCategory) => assetCategory.toLowerCase() === category.toLowerCase())
}
