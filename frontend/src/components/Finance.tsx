import { Transaction, money } from '../lib/types'
import { Button } from './ui/button'
import { Icon } from './ui/common'
export type Edit<T> = {
  create: () => void
  edit: (row: T) => void
  remove: (row: T) => void
}
export function PageTitle({
  title,
  subtitle,
  action,
  create,
}: {
  title: string
  subtitle: string
  action: string
  create: () => void
}) {
  return (
    <header className="between page-title">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <Button onClick={create}>
        <Icon name="plus" size={16} />
        {action}
      </Button>
    </header>
  )
}
export function Amount({ t }: { t: Transaction }) {
  return (
    <strong className="amount">
      {t.type === 'INCOME' ? '+' : '-'} {money(t.amountCents)}
    </strong>
  )
}
export function Direction({ income }: { income: boolean }) {
  return (
    <span className={income ? 'income' : 'expense'}>
      <Icon name={income ? 'circle-arrow-up' : 'circle-arrow-down'} size={16} />
    </span>
  )
}
export function Actions<T>({
  item,
  edit,
  remove,
}: { item: T } & Pick<Edit<T>, 'edit' | 'remove'>) {
  return (
    <div className="actions">
      <Button
        variant="outline"
        aria-label="Excluir"
        onClick={() => remove(item)}
      >
        <Icon name="trash" size={16} />
      </Button>
      <Button variant="outline" aria-label="Editar" onClick={() => edit(item)}>
        <Icon name="square-pen" size={16} />
      </Button>
    </div>
  )
}
