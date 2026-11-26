import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { setToken, useSave } from '../lib/graphql/client'
import { User, initials } from '../lib/types'
import { Icon, Field, ErrorText } from '../components/ui/common'
import { Button } from '../components/ui/button'
const schema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome').max(100),
})
export function Profile({ user }: { user: User }) {
  const [saved, setSaved] = useState(false)
  const form = useForm({
    defaultValues: { name: user.name },
    resolver: zodResolver(schema),
  })
  const save = useSave('profile', () => setSaved(true))
  return (
    <section className="panel authcard profile">
      <header>
        <div className="avatar big">{initials(user.name)}</div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </header>
      <form
        onChange={() => setSaved(false)}
        onSubmit={form.handleSubmit((data) => save.mutate({ data }))}
      >
        <Field
          title="Nome completo"
          error={form.formState.errors.name?.message}
        >
          <span className="input-icon">
            <Icon name="user-round" />
            <input {...form.register('name')} />
          </span>
        </Field>
        <Field title="E-mail" hint="O e-mail não pode ser alterado">
          <span className="input-icon">
            <Icon name="mail" />
            <input disabled value={user.email} />
          </span>
        </Field>
        <ErrorText>{save.error?.message}</ErrorText>
        {saved && <p role="status">Alterações salvas.</p>}
        <Button disabled={save.isPending}>
          {save.isPending ? 'Salvando…' : 'Salvar alterações'}
        </Button>
      </form>
      <Button variant="outline" onClick={() => setToken()}>
        <Icon name="log-out" />
        Sair da conta
      </Button>
    </section>
  )
}
