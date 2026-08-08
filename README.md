# API Aluguel

API REST para cadastro de usuários e imóveis, propostas de aluguel e seu ciclo de aprovação.

## Pré-requisitos

- Docker Desktop com Docker Compose; ou
- Node.js 22+, npm e PostgreSQL 16+.

## Executar com Docker

```bash
docker compose up --build
```

A API estará em `http://localhost:3333`. O Compose aguarda o PostgreSQL ficar saudável e aplica as migrations automaticamente.

```bash
docker compose down       # encerra os containers
docker compose down -v    # encerra e apaga os dados locais do banco
```

> `-v` remove todos os dados do PostgreSQL. Para qualquer ambiente não local, defina um `JWT_SECRET` forte antes de iniciar os containers.

## Executar localmente

```bash
npm install
Copy-Item .env.example .env # PowerShell
docker compose up -d db
npx prisma generate
npx prisma migrate dev
npm run dev
```

Edite `.env` e defina um valor longo e aleatório para `JWT_SECRET`. Em desenvolvimento, caso a variável não seja definida, a API usa uma chave temporária; isso é proibido quando `NODE_ENV=production`. A API local usa `http://localhost:3000` por padrão. O exemplo de ambiente aponta para o banco Docker através de `localhost`.

## Verificação e qualidade

```bash
npm run build
npm test
npm run lint
npm run format:check
```

Use `GET /health` para verificar se o processo HTTP está disponível.

## Autenticação

Cadastre uma conta e faça login para obter um JWT:

```bash
curl -X POST http://localhost:3333/users -H "Content-Type: application/json" -d '{"name":"Maria Silva","email":"maria@example.com","password":"senha-segura"}'

curl -X POST http://localhost:3333/auth/login -H "Content-Type: application/json" -d '{"email":"maria@example.com","password":"senha-segura"}'
```

Envie o token nas rotas protegidas:

```http
Authorization: Bearer <token>
```

O cadastro e o login são públicos; `GET /properties` também é público. As demais rotas de negócio exigem autenticação.

## Endpoints

| Método | Rota                           | Descrição                                          |
| ------ | ------------------------------ | -------------------------------------------------- |
| GET    | `/health`                      | Verifica a disponibilidade da API.                 |
| POST   | `/users`                       | Cadastra um usuário.                               |
| POST   | `/auth/login`                  | Retorna JWT e dados públicos do usuário.           |
| GET    | `/users`                       | Lista usuários sem expor senhas.                   |
| POST   | `/properties`                  | Cadastra imóvel para o usuário autenticado.        |
| GET    | `/properties`                  | Lista imóveis.                                     |
| POST   | `/rental_proposals`            | Cria proposta como usuário autenticado.            |
| GET    | `/rental_proposals`            | Lista propostas vinculadas ao usuário autenticado. |
| PATCH  | `/rental_proposals/:id/status` | Executa uma transição de status.                   |
| GET    | `/rental_proposals/logs`       | Lista logs vinculados ao usuário autenticado.      |

Todas as listagens aceitam `?page=1&limit=20`, com máximo de 100 itens por página.

### Regras de autorização

- `POST /properties` não aceita `ownerId`: o proprietário vem do JWT.
- `POST /rental_proposals` recebe apenas `propertyId`: o interessado vem do JWT.
- Só o proprietário pode avançar, retroceder ou reprovar uma proposta.
- Proprietário e interessado podem cancelar uma proposta.

## Fluxo de proposta

```text
NOVA → ANALISE_CREDITO → CONTRATO_EMITIDO → ASSINADO → ATIVO
```

`ATIVO`, `CANCELADA` e `REPROVADA` são estados finais. Imóveis usam os status `AVAILABLE`, `NEGOTIATING` e `RENTED`.
