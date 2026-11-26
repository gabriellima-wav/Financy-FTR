import { ClientError, GraphQLClient } from 'graphql-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutations } from './mutations'
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
    if (err instanceof ClientError) {
      const error = err.response.errors?.[0]
      if (
        session &&
        token() === session &&
        error?.extensions?.code === 'UNAUTHENTICATED'
      )
        setToken()
      throw new Error(error?.message || 'Falha ao concluir a operação')
    }
    throw new Error('Não foi possível conectar à API. Tente novamente.')
  }
}
export function useSave(action: keyof typeof mutations, done: () => void) {
  const cache = useQueryClient()
  return useMutation({
    mutationFn: (variables: Record<string, unknown>) =>
      request(mutations[action], variables),
    onSuccess: async () => {
      await cache.invalidateQueries({ queryKey: ['workspace'] })
      done()
    },
  })
}
