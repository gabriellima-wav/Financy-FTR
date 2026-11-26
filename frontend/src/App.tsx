import { useEffect, useState, useSyncExternalStore } from 'react'
import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { request, subscribe, token, useSave } from './lib/graphql/client'
import { workspace } from './lib/graphql/queries/workspace'
import { Data, Category, Transaction, initials } from './lib/types'
import { CategoryForm } from './components/CategoryForm'
import { TransactionForm } from './components/TransactionForm'
import { Modal, ErrorText } from './components/ui/common'
import { Button } from './components/ui/button'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Categories } from './pages/Categories'
import { Profile } from './pages/Profile'
import { Auth } from './pages/Auth'
import { mockData } from './lib/mockData'
type Editor =
  | { kind: 'category'; item?: Category }
  | { kind: 'transaction'; item?: Transaction }
  | { kind: 'deleteCategory' | 'deleteTransaction'; id: string; name: string }
function DeleteDialog({
  editor,
  close,
}: {
  editor: Extract<Editor, { id: string }>
  close: () => void
}) {
  const save = useSave(editor.kind, close)
  return (
    <Modal
      title={
        editor.kind === 'deleteCategory'
          ? 'Excluir categoria'
          : 'Excluir transação'
      }
      description={'Deseja excluir “' + editor.name + '”?'}
      close={close}
    >
      <ErrorText>{save.error?.message}</ErrorText>
      <div className="actions">
        <Button variant="outline" onClick={close}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          disabled={save.isPending}
          onClick={() => save.mutate({ id: editor.id })}
        >
          {save.isPending ? 'Excluindo…' : 'Excluir'}
        </Button>
      </div>
    </Modal>
  )
}
function FinanceApp({ session }: { session: string }) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const close = () => setEditor(null)
  const query = useQuery({
    queryKey: ['workspace', session],
    queryFn: () => request<Data>(workspace),
  })
  if (!query.data)
    return (
      <main className="empty" role="status">
        {query.isError ? (
          <>
            <ErrorText>{query.error.message}</ErrorText>
            <Button onClick={() => query.refetch()}>Tentar novamente</Button>
          </>
        ) : (
          'Carregando suas finanças…'
        )}
      </main>
    )
  const data = query.data
  return (
    <>
      <header className="navbar">
        <div className="nav-inner">
          <Link to="/" aria-label="Financy">
            <img src="/Logo.svg" alt="Financy" width="100" height="24" />
          </Link>
          <nav>
            {[
              ['/', 'Dashboard'],
              ['/transacoes', 'Transações'],
              ['/categorias', 'Categorias'],
            ].map(([path, title]) => (
              <NavLink key={path} end to={path}>
                {title}
              </NavLink>
            ))}
          </nav>
          <Link className="avatar" aria-label="Perfil" to="/perfil">
            {initials(data.me.name)}
          </Link>
        </div>
      </header>
      <main className="workspace">
        {query.isError && <ErrorText>{query.error.message}</ErrorText>}
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                data={data}
                create={() => setEditor({ kind: 'transaction' })}
              />
            }
          />
          <Route
            path="/transacoes"
            element={
              <Transactions
                data={data}
                create={() => setEditor({ kind: 'transaction' })}
                edit={(item) => setEditor({ kind: 'transaction', item })}
                remove={(t) =>
                  setEditor({
                    kind: 'deleteTransaction',
                    id: t.id,
                    name: t.description,
                  })
                }
              />
            }
          />
          <Route
            path="/categorias"
            element={
              <Categories
                data={data}
                create={() => setEditor({ kind: 'category' })}
                edit={(item) => setEditor({ kind: 'category', item })}
                remove={(c) =>
                  setEditor({ kind: 'deleteCategory', id: c.id, name: c.title })
                }
              />
            }
          />
          <Route path="/perfil" element={<Profile user={data.me} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {editor?.kind === 'category' && (
        <CategoryForm item={editor.item} close={close} />
      )}
      {editor?.kind === 'transaction' && (
        <TransactionForm
          item={editor.item}
          categories={data.listCategories}
          close={close}
          newCategory={() => setEditor({ kind: 'category' })}
        />
      )}
      {editor && 'id' in editor && (
        <DeleteDialog editor={editor} close={close} />
      )}
    </>
  )
}
function PreviewApp() {
  const [editor, setEditor] = useState<Editor | null>(null)
  const close = () => setEditor(null)
  const data = mockData
  return (
    <>
      <div className="demo-banner">
        Prévia visual com os dados do Figma. Alterações não são salvas.
        <Link to="/">Sair da prévia</Link>
      </div>
      <header className="navbar">
        <div className="nav-inner">
          <Link to="/demo" aria-label="Financy">
            <img src="/Logo.svg" alt="Financy" width="100" height="24" />
          </Link>
          <nav>
            {[
              ['/demo', 'Dashboard'],
              ['/demo/transacoes', 'Transações'],
              ['/demo/categorias', 'Categorias'],
            ].map(([path, title]) => (
              <NavLink key={path} end to={path}>
                {title}
              </NavLink>
            ))}
          </nav>
          <Link className="avatar" aria-label="Perfil" to="/demo/perfil">
            CT
          </Link>
        </div>
      </header>
      <main className="workspace">
        <Routes>
          <Route
            path="/demo"
            element={<Dashboard data={data} create={() => setEditor({ kind: 'transaction' })} />}
          />
          <Route
            path="/demo/transacoes"
            element={
              <Transactions
                data={data}
                create={() => setEditor({ kind: 'transaction' })}
                edit={(item) => setEditor({ kind: 'transaction', item })}
                remove={(item) => setEditor({ kind: 'deleteTransaction', id: item.id, name: item.description })}
              />
            }
          />
          <Route
            path="/demo/categorias"
            element={
              <Categories
                data={data}
                create={() => setEditor({ kind: 'category' })}
                edit={(item) => setEditor({ kind: 'category', item })}
                remove={(item) => setEditor({ kind: 'deleteCategory', id: item.id, name: item.title })}
              />
            }
          />
          <Route path="/demo/perfil" element={<Profile user={data.me} />} />
          <Route path="*" element={<Navigate to="/demo" replace />} />
        </Routes>
      </main>
      {editor?.kind === 'category' && <CategoryForm item={editor.item} close={close} />}
      {editor?.kind === 'transaction' && (
        <TransactionForm item={editor.item} categories={data.listCategories} close={close} newCategory={() => setEditor({ kind: 'category' })} />
      )}
      {editor && 'id' in editor && (
        <Modal title="Prévia somente para leitura" description="Esta prévia não grava nem exclui dados. Entre na sua conta para testar operações." close={close}>
          <Button onClick={close}>Fechar</Button>
        </Modal>
      )}
    </>
  )
}
export function App() {
  const session = useSyncExternalStore(subscribe, token)
  const cache = useQueryClient()
  useEffect(
    () => () => {
      cache.removeQueries({ queryKey: ['workspace', session] })
    },
    [cache, session],
  )
  return session ? (
    <FinanceApp key={session} session={session} />
  ) : (
    <Routes>
      <Route path="/demo/*" element={<PreviewApp />} />
      <Route path="/" element={<Auth key="login" />} />
      <Route path="/cadastro" element={<Auth key="register" signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
