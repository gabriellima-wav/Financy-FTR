import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Category, colors, icons } from '../lib/types'
import { useSave } from '../lib/graphql/client'
import { Icon, Field, ErrorText, Modal } from './ui/common'
import { Button } from './ui/button'

const categorySchema = z.object({
  title: z.string().trim().min(1, 'Informe um título').max(100),
  description: z.string().trim().max(300),
  color: z.string(),
  icon: z.string(),
})
export function CategoryForm({
  item,
  close,
}: {
  item?: Category
  close: () => void
}) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: item ?? {
      title: '',
      description: '',
      icon: icons[0],
      color: colors[0],
    },
  })
  const save = useSave(item ? 'updateCategory' : 'createCategory', close)
  return (
    <Modal
      title={item ? 'Editar categoria' : 'Nova categoria'}
      description="Organize suas transações com categorias"
      close={close}
    >
      <form
        onSubmit={form.handleSubmit((data) =>
          save.mutate({ id: item?.id, data }),
        )}
      >
        <Field title="Título" error={form.formState.errors.title?.message}>
          <input placeholder="Ex. Alimentação" {...form.register('title')} />
        </Field>
        <Field
          title="Descrição"
          hint="Opcional"
          error={form.formState.errors.description?.message}
        >
          <input
            placeholder="Descrição da categoria"
            {...form.register('description')}
          />
        </Field>
        <fieldset>
          <legend>Ícone</legend>
          <div className="icons">
            {icons.map((icon) => (
              <button
                key={icon}
                aria-label={icon}
                type="button"
                aria-pressed={form.watch('icon') === icon}
                onClick={() => form.setValue('icon', icon)}
              >
                <Icon name={icon} />
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Cor</legend>
          <div className="swatches">
            {colors.map((color, i) => (
              <button
                key={color}
                type="button"
                aria-label={
                  [
                    'Verde',
                    'Azul',
                    'Roxo',
                    'Rosa',
                    'Vermelho',
                    'Laranja',
                    'Amarelo',
                  ][i]
                }
                aria-pressed={form.watch('color') === color}
                onClick={() => form.setValue('color', color)}
              >
                <span className={'tone ' + color} />
              </button>
            ))}
          </div>
        </fieldset>
        <ErrorText>{save.error?.message}</ErrorText>
        <Button disabled={save.isPending}>
          {save.isPending ? 'Salvando…' : 'Salvar'}
        </Button>
      </form>
    </Modal>
  )
}
