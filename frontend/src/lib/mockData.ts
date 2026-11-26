import type { Data } from './types'

const categories = [
  { id: 'demo-food', title: 'Alimentação', description: 'Restaurantes, delivery e refeições', icon: 'utensils', color: 'blue' },
  { id: 'demo-transport', title: 'Transporte', description: 'Gasolina, transporte público e viagens', icon: 'car-front', color: 'purple' },
  { id: 'demo-market', title: 'Mercado', description: 'Compras de supermercado e mantimentos', icon: 'shopping-cart', color: 'orange' },
  { id: 'demo-entertainment', title: 'Entretenimento', description: 'Cinema, jogos e lazer', icon: 'ticket', color: 'pink' },
  { id: 'demo-utilities', title: 'Utilidades', description: 'Energia, água, internet e telefone', icon: 'tool-case', color: 'yellow' },
  { id: 'demo-investment', title: 'Investimento', description: 'Aplicações e retornos financeiros', icon: 'piggy-bank', color: 'green' },
  { id: 'demo-salary', title: 'Salário', description: 'Renda mensal e bonificações', icon: 'briefcase-business', color: 'green' },
  { id: 'demo-health', title: 'Saúde', description: 'Medicamentos, consultas e exames', icon: 'heart-pulse', color: 'red' },
]

const byId = Object.fromEntries(categories.map((category) => [category.id, category]))
const records = [
  ['01', 'Pagamento de Salário', '2025-12-01', 425000, 'INCOME', 'demo-salary'],
  ['02', 'Jantar no Restaurante', '2025-11-30', 8950, 'EXPENSE', 'demo-food'],
  ['03', 'Posto de Gasolina', '2025-11-29', 10000, 'EXPENSE', 'demo-transport'],
  ['04', 'Compras no Mercado', '2025-11-28', 15680, 'EXPENSE', 'demo-market'],
  ['05', 'Retorno de Investimento', '2025-11-26', 34025, 'INCOME', 'demo-investment'],
  ['06', 'Aluguel', '2025-11-26', 170000, 'EXPENSE', 'demo-utilities'],
  ['07', 'Freelance', '2025-11-24', 250000, 'INCOME', 'demo-salary'],
  ['08', 'Compras Jantar', '2025-11-22', 15000, 'EXPENSE', 'demo-market'],
  ['09', 'Cinema', '2025-11-18', 8800, 'EXPENSE', 'demo-entertainment'],
  ['10', 'Consulta médica', '2025-11-16', 18000, 'EXPENSE', 'demo-health'],
] as const

export const mockData: Data = {
  me: { id: 'demo-user', name: 'Conta teste', email: 'conta@teste.com' },
  listCategories: categories,
  listTransactions: records.map(([id, description, date, amountCents, type, categoryId]) => ({
    id: `demo-${id}`,
    description,
    date,
    amountCents,
    type,
    category: byId[categoryId],
  })),
}
