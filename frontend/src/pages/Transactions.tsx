import { useState } from 'react'
import { Data, Transaction, currentMonth, displayDate } from '../lib/types'
import { Icon, Tile, Badge, Dropdown, Field } from '../components/ui/common'
import { Button } from '../components/ui/button'
import {
  Actions,
  Edit,
  PageTitle,
  Amount,
  Direction,
} from '../components/Finance'
export function Transactions({
  data,
  ...actions
}: { data: Data } & Edit<Transaction>) {
  const [search, setSearch] = useState(''),
    [type, setType] = useState(''),
    [cat, setCat] = useState(''),
    [period, setPeriod] = useState(currentMonth),
    [asc, setAsc] = useState(false),
    [page, setPage] = useState(0)
  const filtered = data.listTransactions.filter(
    (t) =>
      t.description
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase()) &&
      (!type || t.type === type) &&
      (!cat || t.category.id === cat) &&
      t.date.startsWith(period),
  )
  if (asc) filtered.reverse()
  const size = 10,
    pages = Math.max(1, Math.ceil(filtered.length / size)),
    active = Math.min(page, pages - 1),
    start = active * size
  const periods = [
    ...new Set([
      currentMonth(),
      ...data.listTransactions.map((t) => t.date.slice(0, 7)),
    ]),
  ]
    .sort()
    .reverse()
  return (
    <>
      <PageTitle
        title="Transações"
        subtitle="Gerencie todas as suas transações financeiras"
        action="Nova transação"
        create={actions.create}
      />
      <div className="panel filters" onChange={() => setPage(0)}>
        <Field title="Buscar">
          <span className="input-icon">
            <Icon name="search" />
            <input
              placeholder="Buscar por descrição"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </Field>
        <Field title="Tipo" interactive>
          <Dropdown
            label="Tipo"
            value={type}
            options={[
              { value: '', label: 'Todos' },
              { value: 'INCOME', label: 'Entrada' },
              { value: 'EXPENSE', label: 'Saída' },
            ]}
            onValueChange={(value) => {
              setType(value)
              setPage(0)
            }}
          />
        </Field>
        <Field title="Categoria" interactive>
          <Dropdown
            label="Categoria"
            value={cat}
            options={[
              { value: '', label: 'Todas' },
              ...data.listCategories.map((category) => ({
                value: category.id,
                label: category.title,
              })),
            ]}
            onValueChange={(value) => {
              setCat(value)
              setPage(0)
            }}
          />
        </Field>
        <Field title="Período" interactive>
          <Dropdown
            label="Período"
            value={period}
            options={[
              { value: '', label: 'Todos' },
              ...periods.map((value) => ({
                value,
                label: new Date(value + '-15T12:00:00').toLocaleDateString(
                  'pt-BR',
                  { month: 'long', year: 'numeric' },
                ),
              })),
            ]}
            onValueChange={(value) => {
              setPeriod(value)
              setPage(0)
            }}
          />
        </Field>
      </div>
      <section className="panel table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>
                  <button
                    onClick={() => {
                      setAsc(!asc)
                      setPage(0)
                    }}
                  >
                    Data <Icon name="arrow-up-down" size={12} />
                  </button>
                </th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(start, start + size).map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className="table-desc">
                      <Tile category={t.category} />
                      <strong>{t.description}</strong>
                    </div>
                  </td>
                  <td>{displayDate(t.date)}</td>
                  <td>
                    <Badge category={t.category} />
                  </td>
                  <td>
                    <span
                      className={
                        'inline-amount ' +
                        (t.type === 'INCOME' ? 'income' : 'expense')
                      }
                    >
                      <Direction income={t.type === 'INCOME'} />
                      {t.type === 'INCOME' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td>
                    <Amount t={t} />
                  </td>
                  <td>
                    <Actions item={t} {...actions} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <p className="empty">Nenhuma transação encontrada.</p>
        )}
        <footer className="between pagination">
          <small>
            {filtered.length ? start + 1 : 0}{' a '}
            {Math.min(start + size, filtered.length)} | {filtered.length}{' '}
            resultados
          </small>
          <div className="actions">
            <Button
              variant="outline"
              aria-label="Página anterior"
              disabled={!active}
              onClick={() => setPage(active - 1)}
            >
              <Icon name="chevron-left" size={16} />
            </Button>
            {Array.from(
              { length: Math.min(3, pages) },
              (_, index) =>
                Math.max(0, Math.min(active - 1, pages - 3)) + index,
            ).map((index) => (
              <Button
                key={index}
                className="page-number"
                variant={index === active ? 'default' : 'outline'}
                aria-label={'Página ' + (index + 1)}
                aria-current={index === active ? 'page' : undefined}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              aria-label="Próxima página"
              disabled={active + 1 >= pages}
              onClick={() => setPage(active + 1)}
            >
              <Icon name="chevron-right" size={16} />
            </Button>
          </div>
        </footer>
      </section>
    </>
  )
}
