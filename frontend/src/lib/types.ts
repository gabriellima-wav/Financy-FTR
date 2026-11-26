export interface User {
  id: string
  name: string
  email: string
}
export interface Category {
  id: string
  title: string
  description: string
  icon: string
  color: string
}
export interface Transaction {
  id: string
  description: string
  date: string
  amountCents: number
  type: 'INCOME' | 'EXPENSE'
  category: Category
}
export interface Data {
  me: User
  listCategories: Category[]
  listTransactions: Transaction[]
}
export const icons = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'utensils',
  'paw-print',
  'house',
  'gift',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'receipt-text',
]
export const colors = [
  'green',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
]
export const money = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const displayDate = (date: string) =>
  date.slice(8) + '/' + date.slice(5, 7) + '/' + date.slice(2, 4)
export const currentMonth = () => {
  const now = new Date()
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
}
export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .map((x) => x[0])
    .join('')
    .toUpperCase()
