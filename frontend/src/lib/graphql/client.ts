import { GraphQLClient } from 'graphql-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutations } from './mutations'
import { errorHandlerInterceptor } from './error-handler.interceptor'
import { notify } from '../../components/ui/toast'
const key = 'financy.session'
export const token = () =>
  sessionStorage.getItem(key) || localStorage.getItem(key)
export function setToken(value?: string, remember = false) {
  sessionStorage.removeItem(key)
  localStorage.removeItem(key)
  if (value) (remember ? localStorage : sessionStorage).setItem(key, value)
  window.dispatchEvent(new Event('financy-session'))
}
export function subscribe(fn: () => void) {
  window.addEventListener('financy-session', fn)
  window.addEventListener('storage', fn)
  return () => {
    window.removeEventListener('financy-session', fn)
    window.removeEventListener('storage', fn)
  }
}
export async function request<T>(
  document: string,
  variables: Record<string, unknown> = {},
) {
  const session = token()
  const client = new GraphQLClient(
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/graphql',
    { headers: session ? { Authorization: 'Bearer ' + session } : {} },
  )
  try {
    return await client.request<T>(document, variables)
  } catch (err) {
    throw errorHandlerInterceptor(err, {
      onUnauthenticated: () => {
        if (session && token() === session) setToken()
      },
    })
  }
}

const successMessages: Record<keyof typeof mutations, string> = {
  login: 'Login realizado com sucesso.',
  register: 'Conta criada com sucesso.',
  profile: 'Perfil atualizado com sucesso.',
  createCategory: 'Categoria criada com sucesso.',
  updateCategory: 'Categoria atualizada com sucesso.',
  deleteCategory: 'Categoria excluída com sucesso.',
  createTransaction: 'Transação criada com sucesso.',
  updateTransaction: 'Transação atualizada com sucesso.',
  deleteTransaction: 'Transação excluída com sucesso.',
}

export function useSave(action: keyof typeof mutations, done: () => void) {
  const cache = useQueryClient()
  return useMutation({
    mutationFn: (variables: Record<string, unknown>) =>
      request(mutations[action], variables),
    onSuccess: async () => {
      await cache.invalidateQueries({ queryKey: ['workspace'] })
      notify.success({ title: successMessages[action] })
      done()
    },
  })
}
