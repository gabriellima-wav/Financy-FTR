# Financy

Aplicação de finanças pessoais em português com cadastro, login, perfil, dashboard, categorias e transações. O backend e o frontend têm dependências, scripts e lockfiles independentes. Execute os comandos a partir da pasta indicada.

## Requisitos

Node.js 22.12 ou superior da linha 22, ou Node.js 24, e pnpm 10. O banco SQLite é um arquivo local. A primeira instalação requer acesso aos registros de pacotes e aos binários do Prisma.

## Backend

```sh
cd backend
pnpm install --frozen-lockfile
cp .env.example .env
openssl rand -hex 32
```

Copie o valor gerado pelo último comando para `JWT_SECRET` no arquivo `.env`. A aplicação exige a substituição do valor de exemplo. A configuração padrão `DATABASE_URL="file:./dev.db"` cria o banco em `backend/prisma/dev.db`. A porta padrão é 4000.

```sh
pnpm generate
pnpm exec prisma migrate deploy
pnpm dev
```

A API fica em `http://localhost:4000/graphql`. O Nest gera `backend/schema.graphql` a partir dos decorators ao iniciar. Após alterar o modelo, crie uma nova migration com `pnpm migrate --name nome_da_mudanca`. Para compilar e executar a API compilada, use `pnpm build` e `pnpm start`.

## Frontend

Em outro terminal, a partir da raiz do projeto, execute:

```sh
cd frontend
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Abra `http://localhost:5173`. O endereço da API vem de `VITE_BACKEND_URL`. Para validar o TypeScript e gerar a versão de produção, execute `pnpm build`. Use `pnpm preview` para abrir o build.

## Usar a aplicação

1. Acesse a raiz e selecione **Criar conta**. A conta começa com as listas vazias.
2. Em **Categorias**, crie um título e escolha ícone e cor. A descrição é opcional.
3. No dashboard ou em **Transações**, registre uma despesa ou receita com descrição, data, valor e categoria.
4. Consulte os totais e filtre a lista por descrição, tipo, categoria ou período. O perfil, acessível pelas iniciais na barra superior, permite alterar o nome e sair da conta.

O saldo total considera todo o histórico. Receitas e despesas do mês usam o mês civil local. Os valores são inteiros em centavos e as datas de transação usam `AAAA-MM-DD`. Cada transação pertence a uma categoria do mesmo usuário. Para excluir uma categoria em uso, altere a categoria das transações vinculadas ou exclua essas transações primeiro.

**Lembrar-me** mantém a sessão neste navegador após fechá-lo. As demais sessões são armazenadas na aba. O JWT expira em um dia.

### Recuperação de senha

Para ativar o envio do link, configure `SMTP_URL`, `MAIL_FROM` e `FRONTEND_URL` no backend e reinicie a API. A URL do frontend deve ser a origem que o destinatário consegue abrir. Cada link vale por 15 minutos e pode ser usado uma única vez. O fluxo de cadastro e login funciona sem servidor SMTP.

## Organização

- `backend/src/auth`, `users`, `categories` e `transactions` contêm os módulos NestJS. Os resolvers recebem inputs validados e delegam as operações aos services. O guard GraphQL valida o JWT e fornece a identidade usada nas consultas ao Prisma.
- `backend/prisma` contém o modelo e as migrations. A chave estrangeira composta entre transação e categoria reforça o isolamento entre usuários no próprio banco.
- `frontend/src/lib/graphql` concentra o cliente autenticado e as operações GraphQL. As páginas usam TanStack Query para leitura, invalidação de cache e estados assíncronos.
- `frontend/src/components` contém os formulários, dialogs e primitivas de interface. O style guide do Figma está em `frontend/src/style-guide.css`, com tipografia Inter e paleta semântica. Os componentes e estados de interação usam esses tokens em `frontend/src/styles.css`. O logo e os ícones fornecidos ficam em `frontend/public`.

## Verificação de ponta a ponta

Com as dependências de ambos os projetos instaladas e o Prisma Client gerado, execute a partir de `frontend/`:

```sh
pnpm exec playwright install chromium
pnpm test:e2e
```

A suíte inicia os servidores de teste nas portas 4397 e 4398, aplica as migrations em um banco temporário e exercita cadastro, login, perfil e os dois CRUDs. A verificação da API usa duas contas para testar autenticação, validação, isolamento dos registros e associação de categorias.
