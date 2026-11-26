import { test, expect } from '@playwright/test'
import { randomUUID } from 'node:crypto'

test('cadastro, categorias, transações, perfil e login', async ({ page }) => {
  const email = randomUUID() + '@example.com'
  await page.goto('/')
  await page.getByRole('heading', { name: 'Fazer login' }).waitFor()
  await page.screenshot({ path: test.info().outputPath('login.png') })
  await page.getByRole('link', { name: 'Criar conta' }).click()
  await page.getByLabel('Nome completo').fill('Conta teste')
  await page.getByLabel('E-mail').fill(email)
  await page.getByPlaceholder('Digite sua senha').fill('SenhaTeste123')
  await page.getByRole('button', { name: 'Cadastrar' }).click()
  await page.getByRole('link', { name: 'Categorias', exact: true }).click()
  await page.getByRole('button', { name: 'Nova categoria' }).click()
  await page.getByRole('dialog').getByRole('button', {name:'briefcase-business'}).waitFor()
  await page.getByRole('dialog').locator('.icon').evaluateAll(async elements => {
    await Promise.all(elements.map(async element => {
      const path = getComputedStyle(element).getPropertyValue('--icon').trim().slice(5,-2)
      const image = new Image()
      image.src = path
      await image.decode()
    }))
  })
  await page.screenshot({ path: test.info().outputPath('nova-categoria.png') })
  await page.getByLabel('Título').fill('Mercado')
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Mercado', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Editar' }).click()
  await page.getByLabel('Descrição').fill('Compras do mês')
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(page.getByText('Compras do mês')).toBeVisible()
  await page.getByRole('link', { name: 'Transações', exact: true }).click()
  await page.getByRole('button', { name: 'Nova transação' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Descrição').fill('Feira')
  await page.screenshot({ path: test.info().outputPath('nova-transacao.png') })
  const today = new Date()
  const date = new Date(today.getFullYear(), today.getMonth(), 1)
  await dialog.getByRole('button', { name: 'Data' }).click()
  await page
    .getByRole('gridcell', {
      name: date.toLocaleDateString('pt-BR', { dateStyle: 'full' }),
    })
    .click()
  await dialog.getByLabel(/Valor/).fill('15,25')
  await dialog.getByRole('button', { name: 'Categoria' }).click()
  await page.getByRole('option', { name: 'Mercado' }).click()
  await dialog.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByText('Feira', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Editar' }).click()
  await dialog.getByLabel(/Valor/).fill('22,50')
  await dialog.getByRole('button', { name: 'Salvar' }).click()
  await expect(page.getByText(/22,50/)).toBeVisible()
  await page.getByRole('button', { name: 'Excluir' }).click()
  await dialog.getByRole('button', { name: 'Excluir' }).click()
  await expect(page.getByText('Nenhuma transação encontrada.')).toBeVisible()
  await page.getByRole('link', { name: 'Categorias', exact: true }).click()
  await page.getByRole('button', { name: 'Excluir' }).click()
  await dialog.getByRole('button', { name: 'Excluir' }).click()
  await expect(page.getByText('Nenhuma categoria cadastrada.')).toBeVisible()
  await page.getByRole('link', { name: 'Perfil' }).click()
  await page.getByLabel('Nome completo').fill('Novo nome')
  await page.getByRole('button', { name: 'Salvar alterações' }).click()
  await expect(page.getByRole('heading', { name: 'Novo nome' })).toBeVisible()
  await page.getByRole('button', { name: 'Sair da conta' }).click()
  await page.getByLabel('E-mail').fill(email)
  await page.getByPlaceholder('Digite sua senha').fill('SenhaTeste123')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByText('Saldo total')).toBeVisible()
})

test('API valida os dados e isola as duas contas em todas as operações', async ({
  request,
}) => {
  const apiUrl = process.env.E2E_API_URL || 'http://127.0.0.1:4398/graphql'
  const gql = async (
    query: string,
    variables: Record<string, unknown> = {},
    token = '',
  ) =>
    (
      await request.post(apiUrl, {
        data: { query, variables },
        headers: token ? { Authorization: 'Bearer ' + token } : {},
      })
    ).json()
  const register = async () => {
    const r = await gql(
      'mutation($data:RegisterInput!){register(data:$data){token}}',
      {
        data: {
          name: 'Teste',
          password: 'SenhaTeste123',
          email: randomUUID() + '@example.com',
        },
      },
    )
    return r.data.register.token as string
  }
  const a = await register(),
    b = await register()
  const list = '{listCategories{id} listTransactions{id}}'
  expect((await gql(list)).errors).toBeTruthy()
  const category = { title: 'Mercado', color: 'blue', icon: 'shopping-cart' }
  const c = (
    await gql(
      'mutation($data:CategoryInput!){createCategory(data:$data){id}}',
      { data: category },
      a,
    )
  ).data.createCategory.id
  const t = {
    categoryId: c,
    amountCents: 100,
    date: '2026-01-01',
    type: 'EXPENSE',
    description: 'Compras',
  }
  const create =
    'mutation($data:TransactionInput!){createTransaction(data:$data){id}}'
  expect(
    (await gql(create, { data: { ...t, date: '2026-02-30' } }, a)).errors,
  ).toBeTruthy()
  expect(
    (await gql(create, { data: { ...t, amountCents: 0 } }, a)).errors,
  ).toBeTruthy()
  const id = (await gql(create, { data: t }, a)).data.createTransaction.id
  expect((await gql(list, {}, b)).data).toEqual({
    listCategories: [],
    listTransactions: [],
  })
  expect((await gql(create, { data: t }, b)).errors).toBeTruthy()
  for (const [name, input, key, data] of [
    ['Category', 'CategoryInput', c, category],
    ['Transaction', 'TransactionInput', id, t],
  ] as const) {
    expect(
      (
        await gql(
          `mutation($id:ID!,$data:${input}!){update${name}(id:$id,data:$data){id}}`,
          { id: key, data },
          b,
        )
      ).errors,
    ).toBeTruthy()
    expect(
      (await gql(`mutation($id:ID!){delete${name}(id:$id)}`, { id: key }, b))
        .errors,
    ).toBeTruthy()
  }
  expect(
    (await gql('mutation($id:ID!){deleteCategory(id:$id)}', { id: c }, a))
      .errors,
  ).toBeTruthy()
  expect((await gql(list, {}, a)).data).toEqual({
    listCategories: [{ id: c }],
    listTransactions: [{ id }],
  })
})
