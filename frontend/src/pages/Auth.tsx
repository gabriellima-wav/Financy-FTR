import { Recovery } from '../components/Recovery'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { mutations } from '../lib/graphql/mutations'
import { request, setToken } from '../lib/graphql/client'
import { Button } from '../components/ui/button'
import { Icon, Field, ErrorText } from '../components/ui/common'

export function Auth({ signup = false }: { signup?: boolean }) {
  const resetToken =
    new URLSearchParams(window.location.hash.slice(1)).get('redefinir') ||
    undefined
  const [visible, show] = useState(false),
    [help, setHelp] = useState(Boolean(resetToken))
  const navigate = useNavigate()
  const schema = z.object({
    name: signup
      ? z.string().trim().min(1, 'Informe seu nome').max(100)
      : z.string(),
    email: z.string().trim().email('Informe um e-mail válido').max(254),
    password: z
      .string()
      .min(8, 'Use pelo menos 8 caracteres')
      .refine(
        (v) => new TextEncoder().encode(v).length <= 72,
        'Use até 72 bytes',
      ),
    remember: z.boolean(),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', remember: false },
  })
  const action = signup ? 'register' : 'login'
  const submit = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      remember,
    }: z.infer<typeof schema>) => {
      const result = await request<Record<string, { token: string }>>(
        mutations[action],
        { data: signup ? { name, email, password } : { email, password } },
      )
      setToken(result[action].token, remember)
      navigate('/', { replace: true })
    },
  })
  return (
    <main className="auth">
      <img src="/Logo.svg" width="134" height="32" alt="Financy" />
      <section className="panel authcard">
        <header>
          <h1>{signup ? 'Criar conta' : 'Fazer login'}</h1>
          <p>
            {signup
              ? 'Comece a controlar suas finanças ainda hoje'
              : 'Entre na sua conta para continuar'}
          </p>
        </header>
        <form onSubmit={handleSubmit((v) => submit.mutate(v))} noValidate>
          {signup && (
            <Field title="Nome completo" error={errors.name?.message}>
              <span className="input-icon">
                <Icon name="user-round" />
                <input
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  {...register('name')}
                />
              </span>
            </Field>
          )}
          <Field title="E-mail" error={errors.email?.message}>
            <span className="input-icon">
              <Icon name="mail" />
              <input
                type="email"
                autoComplete="email"
                placeholder="mail@exemplo.com"
                {...register('email')}
              />
            </span>
          </Field>
          <Field
            title="Senha"
            error={errors.password?.message}
            hint={
              signup ? 'A senha deve ter no mínimo 8 caracteres' : undefined
            }
          >
            <span className="input-icon">
              <Icon name="lock" />
              <input
                type={visible ? 'text' : 'password'}
                autoComplete={signup ? 'new-password' : 'current-password'}
                placeholder="Digite sua senha"
                {...register('password')}
              />
              <button
                aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                type="button"
                onClick={() => show(!visible)}
              >
                <Icon name={visible ? 'eye' : 'eye-closed'} />
              </button>
            </span>
          </Field>
          {!signup && (
            <div className="between">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('remember')} />
                Lembrar-me
              </label>
              <button
                type="button"
                className="link"
                onClick={() => setHelp(true)}
              >
                Recuperar senha
              </button>
            </div>
          )}
          <ErrorText>{submit.error?.message}</ErrorText>
          <Button disabled={submit.isPending}>
            {submit.isPending ? 'Aguarde…' : signup ? 'Cadastrar' : 'Entrar'}
          </Button>
        </form>
        <div className="divider">ou</div>
        <footer>
          <p>{signup ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}</p>
          <Button asChild variant="outline">
            <Link to={signup ? '/' : '/cadastro'}>
              <Icon name={signup ? 'log-in' : 'user-round-plus'} />
              {signup ? 'Fazer login' : 'Criar conta'}
            </Link>
          </Button>
        </footer>
      </section>
      {help && (
        <Recovery
          token={resetToken}
          close={() => {
            setHelp(false)
            window.history.replaceState(null, '', window.location.pathname)
          }}
        />
      )}
    </main>
  )
}
