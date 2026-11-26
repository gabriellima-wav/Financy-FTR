import { Data } from './types'
export function categoryStats(data: Data) {
  const totals = new Map<string, { count: number; total: number }>()
  for (const t of data.listTransactions) {
    const stats = totals.get(t.category.id) ?? { count: 0, total: 0 }
    stats.count++
    stats.total += t.amountCents
    totals.set(t.category.id, stats)
  }
  return data.listCategories.map((category) => ({
    category,
    ...(totals.get(category.id) ?? { count: 0, total: 0 }),
  }))
}
