import { Link } from 'react-router-dom'
import { Data, currentMonth, displayDate, money } from '../lib/types'
import { categoryStats } from '../lib/categoryStats'
import { Icon, Tile, Badge } from '../components/ui/common'
import { Amount, Direction } from '../components/Finance'
export function Dashboard({
  data,
  create,
}: {
  data: Data
  create: () => void
}) {
  const month = currentMonth()
  const sums = data.listTransactions.reduce(
    (a, t) => {
      a.balance += t.amountCents * (t.type === 'INCOME' ? 1 : -1)
      if (t.date.startsWith(month)) a[t.type] += t.amountCents
      return a
    },
    { balance: 0, INCOME: 0, EXPENSE: 0 },
  )
  const summaries = [
    ['Saldo total', 'wallet', 'purple', sums.balance],
    ['Receitas do mês', 'circle-arrow-up', 'green', sums.INCOME],
    ['Despesas do mês', 'circle-arrow-down', 'red', sums.EXPENSE],
  ] as const
  return (
    <>
      <div className="stats">
        {summaries.map(([label, icon, color, value]) => (
          <section className="panel summary" key={label}>
            <div className="eyebrow">
              <span className={'ink ' + color}>
                <Icon name={icon} />
              </span>
              {label}
            </div>
            <h1>{money(value)}</h1>
          </section>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="between section-head">
            <h2>Transações recentes</h2>
            <Link className="link" to="/transacoes">
              Ver todas <Icon name="chevron-right" size={16} />
            </Link>
          </div>
          {data.listTransactions.slice(0, 5).map((t) => (
            <div className="recent" key={t.id}>
              <Tile category={t.category} />
              <div className="grow">
                <strong>{t.description}</strong>
                <small>{displayDate(t.date)}</small>
              </div>
              <Badge category={t.category} />
              <div className="inline-amount">
                <Amount t={t} />
                <Direction income={t.type === 'INCOME'} />
              </div>
            </div>
          ))}
          {!data.listTransactions.length && (
            <p className="empty">Nenhuma transação cadastrada.</p>
          )}
          <button className="add-row link" onClick={create}>
            <Icon name="plus" size={16} /> Nova transação
          </button>
        </section>
        <section className="panel">
          <div className="between section-head">
            <h2>Categorias</h2>
            <Link className="link" to="/categorias">
              Gerenciar <Icon name="chevron-right" size={16} />
            </Link>
          </div>
          <div className="category-list">
            {categoryStats(data)
              .sort((a, b) => b.total - a.total)
              .slice(0, 5)
              .map(({ category, count, total }) => (
                <div className="between" key={category.id}>
                  <Badge category={category} />
                  <small>
                    {count} {count === 1 ? 'item' : 'itens'}
                  </small>
                  <strong>{money(total)}</strong>
                </div>
              ))}
            {!data.listCategories.length && (
              <p className="empty">Nenhuma categoria cadastrada.</p>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
