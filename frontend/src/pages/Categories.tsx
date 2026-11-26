import { Data, Category } from '../lib/types'
import { categoryStats } from '../lib/categoryStats'
import { Icon, Tile, Badge } from '../components/ui/common'
import { Actions, Edit, PageTitle } from '../components/Finance'
export function Categories({
  data,
  ...actions
}: { data: Data } & Edit<Category>) {
  const stats = categoryStats(data),
    top = [...stats].sort((a, b) => b.count - a.count)[0]
  return (
    <>
      <PageTitle
        title="Categorias"
        subtitle="Organize suas transações por categorias"
        action="Nova categoria"
        create={actions.create}
      />
      <div className="stats">
        {[
          [stats.length, 'Total de categorias', 'tag', 'neutral'],
          [
            data.listTransactions.length,
            'Total de transações',
            'arrow-up-down',
            'purple',
          ],
          [
            top?.count ? top.category.title : '—',
            'Categoria mais utilizada',
            top?.category.icon ?? 'tag',
            top?.category.color ?? 'blue',
          ],
        ].map(([value, label, icon, color]) => (
          <section key={label} className="panel statline">
            <span className={'ink ' + color}>
              <Icon name={String(icon)} size={28} />
            </span>
            <div>
              <strong>{value}</strong>
              <h2>{label}</h2>
            </div>
          </section>
        ))}
      </div>
      <div className="cards">
        {stats.map(({ category: c, count }) => (
          <article className="panel category-card" key={c.id}>
            <div className="between">
              <Tile category={c} />
              <Actions item={c} {...actions} />
            </div>
            <div>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
            </div>
            <footer className="between">
              <Badge category={c} />
              <small>
                {count} {count === 1 ? 'item' : 'itens'}
              </small>
            </footer>
          </article>
        ))}
      </div>
      {!stats.length && (
        <p className="panel empty">Nenhuma categoria cadastrada.</p>
      )}
    </>
  )
}
