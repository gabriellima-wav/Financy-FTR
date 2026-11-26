import { ClientError } from 'graphql-request'
import { notify } from '../../components/ui/toast'

type ErrorHandlerOptions = {
  onUnauthenticated?: () => void
}

/**
 * Transforma falhas de transporte e do GraphQL em uma mensagem consistente
 * para a interface. O cliente GraphQL é o único ponto que chama a API, então
 * este interceptor cobre queries e mutations sem duplicar tratamento nas telas.
 */
export function errorHandlerInterceptor(
  error: unknown,
  { onUnauthenticated }: ErrorHandlerOptions = {},
) {
  let message = 'Não foi possível conectar à API. Tente novamente.'

  if (error instanceof ClientError) {
    const graphQLError = error.response.errors?.[0]
    message = graphQLError?.message || 'Falha ao concluir a operação'

    if (graphQLError?.extensions?.code === 'UNAUTHENTICATED') {
      onUnauthenticated?.()
    }
  }

  notify.error({
    id: 'api-error',
    title: 'Não foi possível concluir a operação',
    description: message,
  })

  return new Error(message)
}
