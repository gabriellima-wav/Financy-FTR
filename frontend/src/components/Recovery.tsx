import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { request } from '../lib/graphql/client'
import { Modal, Field, ErrorText } from './ui/common'
import { Button } from './ui/button'
export function Recovery({
  token,
  close,
}: {
  token?: string
  close: () => void
}) {
  const schema = z.object({
    value: token
      ? z
          .string()
          .min(8, 'Use pelo menos 8 caracteres')
          .refine(
            (v) => new TextEncoder().encode(v).length <= 72,
            'Senha muito longa',
          )
      : z.string().trim().email('Informe um e-mail válido'),
  })
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })
  const save = useMutation({
    mutationFn: ({ value }: z.infer<typeof schema>) =>
      token
        ? request(
            'mutation Reset($data:ResetInput!){resetPassword(data:$data)}',
            { data: { token, password: value } },
          )
        : request(
            'mutation Recovery($data:RecoveryInput!){requestPasswordReset(data:$data)}',
            { data: { email: value } },
          ),
  })
  return (
    <Modal title={token ? 'Redefinir senha' : 'Recuperar senha'} close={close}>
      {save.isSuccess ? (
        <>
          <p role="status">
            {token
              ? 'Senha atualizada. Faça login com a nova senha.'
              : 'Se houver uma conta para esse e-mail, você receberá um link para redefinir a senha.'}
          </p>
          <Button onClick={close}>Voltar ao login</Button>
        </>
      ) : (
        <form onSubmit={form.handleSubmit((v) => save.mutate(v))}>
          <Field
            title={token ? 'Nova senha' : 'E-mail'}
            error={form.formState.errors.value?.message}
          >
            <input
              type={token ? 'password' : 'email'}
              autoComplete={token ? 'new-password' : 'email'}
              {...form.register('value')}
            />
          </Field>
          <ErrorText>{save.error?.message}</ErrorText>
          <Button disabled={save.isPending}>
            {save.isPending
              ? 'Aguarde…'
              : token
                ? 'Salvar senha'
                : 'Enviar link'}
          </Button>
        </form>
      )}
    </Modal>
  )
}
