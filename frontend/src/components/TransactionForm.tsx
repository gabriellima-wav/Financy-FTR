import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Category, Transaction } from '../lib/types'
import { useSave } from '../lib/graphql/client'
import { Icon, DatePicker, Dropdown, Field, ErrorText, Modal } from './ui/common'
import { Button } from './ui/button'

const transactionSchema = z.object({
  description: z.string().trim().min(1, 'Informe a descrição').max(200),
  type: z.enum(['EXPENSE', 'INCOME']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Selecione a data'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  amount: z
    .string()
    .trim()
    .regex(
      /^\d+(?:[,.]\d{1,2})?$/,
      'Informe um valor com até duas casas decimais',
    )
    .refine((v) => {
      const n = cents(v)
      return n > 0 && n <= 2147483647
    }, 'Informe um valor entre R$ 0,01 e R$ 21.474.836,47'),
})
function cents(value: string) {
  const [whole, fraction = ''] = value.replace(',', '.').split('.')
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
}
export function TransactionForm({
  item,
  categories,
  close,
  newCategory,
}: {
  item?: Transaction
  categories: Category[]
  close: () => void
  newCategory: () => void
}) {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: item?.type ?? 'EXPENSE',
      description: item?.description ?? '',
      date: item?.date ?? '',
      amount: item ? (item.amountCents / 100).toFixed(2).replace('.', ',') : '',
      categoryId: item?.category.id ?? '',
    },
  })
  const save = useSave(item ? 'updateTransaction' : 'createTransaction', close)
  const errors = form.formState.errors
  return (
    <Modal
      title={item ? 'Editar transação' : 'Nova transação'}
      description="Registre sua despesa ou receita"
      close={close}
    >
      <form
        onSubmit={form.handleSubmit(({ amount, ...data }) =>
          save.mutate({
            id: item?.id,
            data: { ...data, amountCents: cents(amount) },
          }),
        )}
      >
        <div className="segments">
          {(['EXPENSE', 'INCOME'] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={form.watch('type') === t}
              onClick={() => form.setValue('type', t)}
            >
              <Icon
                name={t === 'EXPENSE' ? 'circle-arrow-down' : 'circle-arrow-up'}
              />
              {t === 'EXPENSE' ? 'Despesa' : 'Receita'}
            </button>
          ))}
        </div>
        <Field title="Descrição" error={errors.description?.message}>
          <input
            placeholder="Ex. Almoço no restaurante"
            {...form.register('description')}
          />
        </Field>
        <div className="pair">
          <Field title="Data" error={errors.date?.message} interactive>
            <DatePicker
              label="Data"
              value={form.watch('date')}
              onValueChange={(date) =>
                form.setValue('date', date, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
            />
          </Field>
          <Field title="Valor" error={errors.amount?.message}>
            <span className="currency">
              <span>R$</span>
              <input
                inputMode="decimal"
                placeholder="0,00"
                {...form.register('amount')}
              />
            </span>
          </Field>
        </div>
        <Field title="Categoria" error={errors.categoryId?.message} interactive>
          <Dropdown
            label="Categoria"
            value={form.watch('categoryId')}
            options={[
              { value: '', label: 'Selecione' },
              ...categories.map((category) => ({
                value: category.id,
                label: category.title,
              })),
            ]}
            onValueChange={(categoryId) =>
              form.setValue('categoryId', categoryId, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
          />
        </Field>
        {!categories.length && (
          <button className="link" type="button" onClick={newCategory}>
            Criar primeira categoria
          </button>
        )}
        <ErrorText>{save.error?.message}</ErrorText>
        <Button disabled={save.isPending || !categories.length}>
          {save.isPending ? 'Salvando…' : 'Salvar'}
        </Button>
      </form>
    </Modal>
  )
}
