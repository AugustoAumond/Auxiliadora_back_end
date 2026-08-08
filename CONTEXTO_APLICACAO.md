# Contexto da Aplicação — API Aluguel

> **Regra de manutenção:** antes de responder a qualquer nova solicitação sobre este repositório, consultar este arquivo. Ao final de cada solicitação, atualizar as seções afetadas, a data de atualização e o histórico resumido abaixo.

**Última atualização:** 08/08/2026  
**Status da compilação:** `tsc --noEmit` concluído com sucesso nesta data.

## Objetivo

API REST para o ciclo de aluguel de imóveis: cadastro de usuários e imóveis, criação de propostas, transições de status e consulta de histórico.

## Stack e execução

- Node.js, TypeScript, Express 5, Zod e Prisma 6.
- PostgreSQL 16 via Docker Compose.
- Desenvolvimento: `npm run dev`.
- Produção: `npm run build` e `npm start`.
- Docker expõe a API em `3333` e o banco em `5432`.
- Variáveis necessárias: `DATABASE_URL` e, opcionalmente, `PORT`.

## Organização

```
src/
  controllers/       Adaptam HTTP para os serviços
  services/          Regras de negócio
  repositories/      Acesso ao Prisma
  validators/        Schemas Zod
  state_machine/     Transições de proposta
  errors/            AppError e middleware de erros
  database/          Instância Prisma
prisma/              Schema e migrations
```

Não há prefixo global de rota, autenticação, testes automatizados ou documentação OpenAPI no estado atual.

## Modelo de dados

- `users`: id UUID, nome, e-mail único, senha e data de criação.
- `properties`: proprietário, endereço, cidade, descrição, valor, quartos, vaga e status textual.
- `rental_proposal`: interessado, imóvel, status enum e datas de criação/atualização.
- `rental_proposal_logs`: trilha das mudanças, incluindo imóvel, interessado, proprietário, statuses e mensagem.

Relações principais: um usuário possui imóveis; uma proposta liga usuário interessado a imóvel; logs referenciam imóvel e interessado.

## Endpoints atuais

| Método | Rota | Finalidade |
| --- | --- | --- |
| POST | `/users` | Cadastra usuário |
| GET | `/users` | Lista usuários |
| POST | `/properties` | Cadastra imóvel |
| GET | `/properties` | Lista imóveis |
| POST | `/rental_proposals` | Cria proposta |
| GET | `/rental_proposals` | Lista propostas |
| PATCH | `/rental_proposals/:id/status` | Executa uma ação de fluxo |
| GET | `/rental_proposals/logs` | Lista logs de propostas |

## Fluxo de proposta

Status válidos: `NOVA` → `ANALISE_CREDITO` → `CONTRATO_EMITIDO` → `ASSINADO` → `ATIVO`.

- Ações: `AVANCAR`, `RETROCEDER`, `CANCELAR` e `REPROVAR`.
- `CANCELAR` e `REPROVAR` são bloqueadas após `ATIVO`.
- Ao criar proposta, o imóvel muda de `disponível` para `em_negociacao`.
- Ao cancelar/reprovar, muda para `disponível`; ao ativar, muda para `alugado`.
- Atualizações de status geram log dentro de transação.

## Validações e erros

- Zod valida payloads de criação; falhas retornam HTTP 400.
- Regras de negócio usam `AppError` com status HTTP.
- O middleware converte erros desconhecidos em HTTP 500.
- CORS está aberto para qualquer origem.

## Pontos de atenção identificados

1. Senhas usam MD5 sem salt, que não é adequado para credenciais. Migrar para Argon2id ou bcrypt antes de produção e nunca retornar hashes em listagens/respostas.
2. Não há autenticação/autorização. O `ownerId` informado no corpo permite criar imóvel em nome de outro usuário; ações de proposta não têm controle de permissão.
3. A criação de proposta verifica o imóvel, mas não confirma se `applicantId` existe. A constraint do banco acabará retornando um erro genérico.
4. Os statuses de imóvel são strings livres e há caracteres corrompidos em `disponível` e em mensagens em português. Centralizar em enum/constantes e corrigir a codificação UTF-8 por migration.
5. Listagens não têm paginação, filtros, ordenação nem seleção de campos; `GET /users` expõe o campo `password` hashado.
6. Não há teste automatizado, health check, documentação de API ou limitação de requisições.
7. O controller de propostas instancia o serviço duas vezes e possui nomenclatura inconsistente; isso não quebra o fluxo, mas deve ser simplificado.
8. Alterações locais não commitadas já existem em Docker, dependências, servidor e fluxo de propostas. Preservá-las até confirmação do responsável.

## Decisões e histórico de contexto

| Data | Solicitação | Registro |
| --- | --- | --- |
| 08/08/2026 | Revisão inicial e criação do contexto | Estrutura e fluxo mapeados; compilação verificada; riscos registrados. |

## Procedimento para próximas solicitações

1. Ler este arquivo e considerar o estado/decisões já registradas.
2. Executar a solicitação preservando alterações locais não relacionadas.
3. Verificar o resultado com a checagem adequada.
4. Atualizar este documento: data, arquitetura/contratos afetados, decisões, riscos e uma entrada no histórico.
