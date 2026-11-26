# Financy — status do projeto

Atualizado em 26/11/2026.

## Concluído

### Back-end

- [x] API em TypeScript com NestJS, GraphQL, Prisma e SQLite.
- [x] Cadastro de usuário.
- [x] Login com JWT.
- [x] CORS habilitado.
- [x] Validação de inputs no servidor.
- [x] Listagem de categorias do usuário autenticado.
- [x] Criação, edição e exclusão de categorias.
- [x] Listagem de transações do usuário autenticado.
- [x] Criação, edição e exclusão de transações.
- [x] Isolamento de dados por usuário: consultas filtram por `userId`; edições e exclusões usam `id` e `userId`.
- [x] Relação entre categoria e transação impede vincular uma transação a uma categoria de outro usuário.
- [x] `backend/.env.example` com `JWT_SECRET`, `DATABASE_URL` e variáveis complementares documentadas.

### Front-end

- [x] Aplicação React em TypeScript com Vite.
- [x] Comunicação com a API usando GraphQL (`graphql-request`).
- [x] Cache e atualização de dados com React Query.
- [x] Formulários com React Hook Form e Zod.
- [x] Tela de login e cadastro.
- [x] Raiz (`/`) exibe login para visitante e dashboard para usuário autenticado.
- [x] Página de transações com busca, filtros, paginação e ordenação por data.
- [x] Criação, edição, exclusão e listagem de transações.
- [x] Página de categorias com criação, edição, exclusão e listagem.
- [x] Página de perfil.
- [x] Dialogs de formulário para categoria e transação.
- [x] Dropdowns personalizados nos filtros de transações e no campo Categoria do formulário.
- [x] Datepicker personalizado no campo Data do formulário de transação.
- [x] Ícones e logo organizados em `frontend/public`.
- [x] Layout baseado no style guide e na referência do Figma, com revisão pontual da tela de Transações.

### Qualidade e execução

- [x] `.gitignore` ignora dependências, builds, bancos SQLite, arquivos `.env` e relatórios de teste.
- [x] Build do frontend passa com `npm run build`.
- [x] Há testes E2E para cadastro, login, CRUD de categorias e transações, perfil e isolamento entre contas.
- [x] Estrutura de entrega contém as pastas `backend/` e `frontend/`.

## Pendências antes da entrega

- [x] Variável do frontend alinhada ao enunciado: `VITE_BACKEND_URL` é usada no template, no cliente GraphQL e na configuração de testes.
- [ ] Fazer a revisão visual final, página a página, contra o Figma: login, cadastro, dashboard, transações, categorias e perfil.
- [ ] Executar novamente a suíte E2E após os últimos ajustes visuais e de componentes. Última tentativa bloqueada pelo ambiente antes de rodar os casos: `listen EPERM 127.0.0.1:4398`.
- [ ] Inicializar o repositório Git neste diretório, se ainda não existir.
- [ ] Criar um repositório público no GitHub e enviar o código.
- [ ] Confirmar que nenhum `.env`, banco SQLite local, `node_modules`, `dist` ou relatório de teste foi enviado ao GitHub.

## Itens extras já presentes

- [x] Recuperação e redefinição de senha por e-mail, configurável via SMTP.
- [x] Prévia de demonstração com dados locais em `/demo`.
- [x] Componentes de dropdown e datepicker personalizados.

> O enunciado recomenda manter recursos extras em uma branch separada antes da correção. Caso queira seguir essa recomendação literalmente, entregue a branch principal apenas com os requisitos obrigatórios e mantenha estes itens em uma branch complementar.
