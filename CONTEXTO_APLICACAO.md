# Contexto da Aplicação — API Aluguel

> **Regra de manutenção:** consultar este arquivo antes de cada nova recomendação ou alteração neste repositório e atualizá-lo ao final da solicitação.

**Última atualização:** 08/08/2026  
**Validação atual:** `npm run build`, `npm test`, `npm run lint`, `npm run format:check`, `npx prisma validate`, `docker compose config --quiet` e `npm audit --omit=dev` passaram; a auditoria de dependências de produção não encontrou vulnerabilidades.

## Objetivo e stack

API REST de aluguel com Node.js, TypeScript, Express 5, Zod, Prisma 6 e PostgreSQL 16. A aplicação usa Docker Compose para desenvolvimento e disponibiliza a API em `3333`; localmente, a porta padrão é `3000`.

## Estrutura

```text
src/
  controllers/   adaptação HTTP
  services/      regras de negócio e autorização
  repositories/  Prisma e paginação
  validators/    contratos Zod
  middlewares/   autenticação JWT
  state_machine/ ciclo de propostas
  errors/        erros padronizados
prisma/          schema e migrations
tests/           testes unitários do fluxo
```

## Modelo e regras de negócio

- `users`: email único e senha bcrypt. Hashes MD5 legados são rehashados para bcrypt após um login válido.
- `properties`: proprietário, dados do imóvel, `value Decimal(12,2)` e `PropertyStatus` (`AVAILABLE`, `NEGOTIATING`, `RENTED`).
- `rental_proposal`: interessado, imóvel e estado `NOVA → ANALISE_CREDITO → CONTRATO_EMITIDO → ASSINADO → ATIVO`, além de `REPROVADA` e `CANCELADA`.
- `rental_proposal_logs`: histórico de atualizações de status.
- Estados finais não aceitam novas transições. A criação de proposta reivindica atomicamente o imóvel disponível; há índice único parcial para uma proposta aberta por imóvel.

## API, autenticação e contratos

- Públicos: `GET /health`, `POST /users`, `POST /auth/login`, `GET /properties`.
- Protegidos por Bearer JWT: listagem de usuários, criação de imóvel, propostas e logs.
- O JWT determina proprietário e interessado; os campos `ownerId`, `applicantId` e `status` não são aceitos nos payloads de criação.
- Apenas proprietário avança/retrocede/reprova; proprietário ou interessado cancelam.
- Listagens retornam `{ data, meta }` com paginação (`page`, `limit`, máximo 100); propostas e logs são filtrados pelo usuário autenticado. Senhas nunca são retornadas.

## Operação e qualidade

- `dotenv/config` carrega o ambiente. `.env.example` documenta `DATABASE_URL`, `PORT`, `JWT_SECRET` e `CORS_ORIGIN`. Sem `JWT_SECRET`, apenas desenvolvimento usa uma chave temporária; produção falha ao iniciar.
- Docker aguarda health check do PostgreSQL, aplica migrations e possui encerramento gracioso/Prisma disconnect no servidor.
- O entrypoint Docker executa `npm ci` e `prisma generate` antes das migrations para evitar que o volume de `node_modules` fique desatualizado em relação ao `package-lock.json`.
- `ts-node.files` está habilitado para que o `ts-node-dev` carregue a extensão global de `Express.Request` usada por `req.auth`.
- Scripts: `dev`, `build`, `start`, `test`, `lint`, `format:check`.
- ESLint e Prettier configurados; há testes unitários para transições da máquina de estados.

## Pontos pendentes

1. Adicionar OpenAPI, rate limiting, logs estruturados, CI e testes de integração contra PostgreSQL.
2. Antes de aplicar `20260808120000_harden_domain` em produção, auditar valores de status desconhecidos: a migration os converte para `AVAILABLE`.
3. A autorização atual é por recurso (proprietário/interessado); ainda não há papéis administrativos formais.
4. Criar uma imagem Docker de produção separada da configuração atual de desenvolvimento com bind mount e `ts-node-dev`.

## Histórico

| Data       | Solicitação                     | Registro                                                                                                                               |
| ---------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 08/08/2026 | Revisão inicial                 | Arquitetura, fluxo e riscos mapeados.                                                                                                  |
| 08/08/2026 | README de execução              | Documentada execução local e Docker.                                                                                                   |
| 08/08/2026 | Revisão de código               | Priorizadas melhorias de segurança, integridade, concorrência e qualidade.                                                             |
| 08/08/2026 | Implementação das recomendações | JWT, bcrypt, autorização, paginação, enum/Decimal, migration, índices, health check, ferramentas de qualidade e testes implementados.  |
| 08/08/2026 | Correção de inicialização local | JWT usa chave temporária somente fora de produção quando `.env` não define `JWT_SECRET`; produção continua exigindo segredo explícito. |
| 11/08/2026 | Correção do Docker              | Entry point sincroniza dependências e Prisma Client para impedir que volume antigo de `node_modules` oculte novas dependências.        |
| 11/08/2026 | Correção de tipos no Docker     | `ts-node-dev` passa a carregar arquivos de declaração globais, corrigindo o tipo de `req.auth`.                                        |
