# 1. Clonar o repositório

``` bash
git clone https://github.com/AugustoAumond/Auxiliadora_back_end.git
```

Entrar na pasta:

``` bash
cd api-alugel
```

# 2. Instalar dependências

Caso esteja usando Node local:

``` bash
npm install
```

# 3. Configurar variáveis de ambiente

Criar o arquivo:

``` bash
.env
```

``` BASH
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/api_alugel"
```

Onde:
Configuração	Valor
Usuário	postgres
Senha	postgres
Host	localhost
Porta	5432
Banco	api_alugel

# 4. Criar o banco de dados PostgreSQL

Acessar o PostgreSQL:

``` bash
psql -U postgres
```

Caso o comando acima não funcione no PowerShell, execute diretamente o executável:

``` bash
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
```

Criar o banco:

``` bash
CREATE DATABASE api_alugel;
```

# 5. Configurar o Prisma

``` bash
npx prisma generate
```

# 6. Executar as migrations

``` bash
npx prisma migrate dev
```
# 7. Executar a aplicação

Modo desenvolvimento:

``` bash
npm run dev
```

A aplicação será iniciada utilizando o ambiente local.

# 8. Testar a API

Utilizar ferramentas como:

``` bash
Bruno
Postman
Insomnia
```


Exemplo:

``` bash
GET /properties
```

# 9. Arquivo com todas requisições (Bruno App)

[API ALUGUEL-documentation-local.html](https://github.com/user-attachments/files/29897213/API.ALUGUEL-documentation-local.html)

# Descrição da Aplicação

A aplicação consiste em uma API REST desenvolvida para gerenciamento de imóveis e processos de locação, permitindo controlar desde o cadastro de propriedades até o ciclo completo de uma proposta de aluguel.

O sistema foi desenvolvido com uma arquitetura baseada em camadas, separando responsabilidades entre controllers, services, repositories e banco de dados, proporcionando maior organização, facilidade de manutenção e escalabilidade.

O fluxo principal da aplicação é baseado no gerenciamento de propostas de locação. Usuários proprietários podem cadastrar imóveis, enquanto usuários interessados podem enviar propostas para imóveis disponíveis. Cada proposta possui um ciclo de vida controlado por uma máquina de estados, responsável por validar e gerenciar as transições entre as etapas do processo.

A máquina de estados garante que uma proposta siga um fluxo controlado, evitando alterações inválidas e mantendo a integridade das regras de negócio. O fluxo contempla desde a criação da proposta até sua ativação, incluindo etapas intermediárias como análise de crédito, emissão de contrato e assinatura, além dos estados finais de reprovação ou cancelamento.

Além do gerenciamento do fluxo de propostas, a aplicação possui controle automático do status dos imóveis conforme o andamento das negociações.

Quando uma nova proposta é criada para um imóvel disponível, o status do imóvel é atualizado para `EM_NEGOCIACAO`, indicando que existe uma negociação em andamento.

Caso a proposta avance por todas as etapas do fluxo e alcance o status `ATIVO`, representando que o contrato foi concluído, o imóvel é atualizado automaticamente para `ALUGADO`.

Caso a proposta seja cancelada ou reprovada durante o processo, o imóvel retorna automaticamente para o status `DISPONIVEL`, permitindo que novas propostas sejam realizadas.

Para garantir rastreabilidade, todas as alterações realizadas nas propostas são registradas em uma tabela de logs, permitindo consultar o histórico completo das movimentações realizadas durante o processo.

A aplicação utiliza PostgreSQL como banco de dados, Prisma ORM para gerenciamento da persistência, Zod para validação dos dados recebidos e um middleware global para padronização dos erros retornados pela API.

Principais funcionalidades:

- Cadastro e gerenciamento de usuários;
- Cadastro e consulta de imóveis;
- Criação e acompanhamento de propostas de aluguel;
- Controle de fluxo de propostas através de máquina de estados;
- Atualização automática do status dos imóveis;
- Registro histórico das alterações realizadas;
- Validação dos dados de entrada;
- Tratamento padronizado de erros da aplicação.

A estrutura foi desenvolvida visando uma base organizada e preparada para futuras evoluções, como autenticação via JWT, integração com serviços externos de análise de crédito e gerenciamento completo de contratos de locação.

# Gerenciamento e consulta de usuários

A aplicação possui um módulo responsável pelo gerenciamento dos usuários que participam do processo de locação.

Os usuários representam os participantes do sistema, podendo atuar como proprietários de imóveis ou interessados em realizar propostas de aluguel.

O cadastro de usuários permite registrar as informações necessárias para identificação e relacionamento com as demais entidades da aplicação, como imóveis e propostas de locação.

Durante a criação de um usuário, são realizadas validações dos dados recebidos, garantindo que as informações obrigatórias sejam preenchidas corretamente e evitando inconsistências no banco de dados.

A consulta de usuários permite recuperar os usuários cadastrados no sistema, possibilitando a visualização das informações armazenadas e servindo como base para os relacionamentos existentes na aplicação.

Principais responsabilidades:

- Cadastro de novos usuários;
- Validação dos dados de entrada;
- Consulta dos usuários cadastrados;
- Relacionamento dos usuários com imóveis e propostas de aluguel;
- Garantia da integridade dos dados persistidos.

# Gerenciamento e cadastro de imóveis

A aplicação possui um módulo responsável pelo gerenciamento dos imóveis disponíveis para locação.

Os imóveis representam as propriedades cadastradas pelos usuários proprietários e possuem informações necessárias para identificação, localização e descrição da oferta, além do controle do seu status dentro do processo de negociação.

O cadastro de imóveis é realizado vinculando uma propriedade a um usuário proprietário previamente cadastrado. Durante esse processo, são validadas as informações recebidas, garantindo que os dados obrigatórios estejam preenchidos corretamente e que o proprietário informado exista no sistema.

Cada imóvel possui um ciclo de status que representa sua situação atual dentro do processo de locação:

- `DISPONIVEL`: imóvel disponível para receber novas propostas;
- `EM_NEGOCIACAO`: imóvel possui uma proposta em andamento;
- `ALUGADO`: imóvel teve uma proposta concluída e o contrato foi ativado.

O status do imóvel é atualizado automaticamente conforme o andamento das propostas relacionadas, garantindo que o sistema mantenha a consistência entre o processo de negociação e a disponibilidade da propriedade.

Principais responsabilidades:

- Cadastro de novos imóveis;
- Validação dos dados do imóvel;
- Associação do imóvel ao seu proprietário;
- Consulta dos imóveis cadastrados;
- Controle do status da propriedade;
- Integração com o fluxo de propostas de aluguel;
- Garantia de que imóveis indisponíveis não recebam novas negociações.

# Fluxo de propostas de aluguel

A aplicação possui um módulo responsável pelo gerenciamento das propostas de aluguel, controlando todo o ciclo de vida de uma negociação entre o usuário interessado e o proprietário do imóvel.

O processo inicia quando um usuário interessado realiza uma proposta para um imóvel que esteja disponível. Antes da criação da proposta, o sistema valida as informações necessárias e verifica se o imóvel está apto para receber uma nova negociação.

Após a criação, a proposta passa por um fluxo de etapas que representam a evolução da negociação, desde a análise inicial até a conclusão do contrato de locação.

O fluxo principal da proposta é:

```text
NOVA
 |
 ↓
ANALISE_CREDITO
 |
 ↓
CONTRATO_EMITIDO
 |
 ↓
ASSINADO
 |
 ↓
ATIVO
```

Além do fluxo principal, existem estados responsáveis pelo encerramento da proposta antes da conclusão:

```text
REPROVADA
CANCELADA
```

Quando uma proposta atinge o status `ATIVO`, significa que todas as etapas necessárias foram concluídas e o contrato de locação foi efetivado.

Caso uma proposta seja cancelada ou reprovada durante o processo, a negociação é encerrada e o imóvel retorna automaticamente para o status `DISPONIVEL`, permitindo que novas propostas sejam realizadas.

---

# Máquina de estados

Para garantir a integridade do fluxo de propostas, a aplicação utiliza uma máquina de estados responsável por controlar todas as transições de status.

A alteração do status da proposta não é realizada diretamente pelo cliente. Em vez disso, a aplicação recebe uma ação solicitada e a máquina de estados valida se aquela transição é permitida considerando o status atual da proposta.

Essa abordagem centraliza as regras de negócio e impede que uma proposta avance ou retroceda de maneira inválida.

---

## Funcionamento

A máquina recebe dois parâmetros:

### Status atual

Representa o estado atual da proposta.

Exemplo:

```text
NOVA
```

### Ação solicitada

Representa a operação desejada sobre a proposta.

Exemplo:

```json
{
  "action": "AVANCAR"
}
```

A máquina avalia a combinação entre o status atual e a ação solicitada e define qual será o próximo status permitido.

Exemplo:

Entrada:

```text
Status atual:
NOVA

Ação:
AVANCAR
```

Resultado:

```text
ANALISE_CREDITO
```

---

# Ações disponíveis

## AVANCAR

Responsável por mover a proposta para a próxima etapa do fluxo.

Exemplo:

```text
NOVA
 |
 ↓
ANALISE_CREDITO
```

A proposta só poderá avançar caso exista uma transição válida definida na máquina de estados.

---

## RETROCEDER

Responsável por retornar a proposta para uma etapa anterior quando permitido pelas regras de negócio.

Essa ação impede alterações diretas de status, garantindo que o retorno siga o fluxo definido pela aplicação.

Exemplo:

```text
ANALISE_CREDITO
 |
 ↓
NOVA
```

---

## CANCELAR

Responsável por encerrar uma proposta antes da conclusão do contrato.

Resultado:

```text
CANCELADA
```

Ao cancelar uma proposta:

- O status da proposta é atualizado;
- Um registro é criado no histórico de alterações;
- O imóvel retorna para o status `DISPONIVEL`.

---

## REPROVAR

Responsável por encerrar uma proposta que não foi aprovada durante o processo.

Resultado:

```text
REPROVADA
```

Ao reprovar uma proposta:

- O status da proposta é atualizado;
- Um registro é criado no histórico de alterações;
- O imóvel retorna para o status `DISPONIVEL`.

---

# Integração com o status do imóvel

O status do imóvel é atualizado conforme o andamento das propostas relacionadas.

O fluxo de atualização ocorre da seguinte forma:

```text
Imóvel DISPONIVEL
        |
        ↓
Nova proposta criada
        |
        ↓
Imóvel EM_NEGOCIACAO
        |
        ↓
Proposta ATIVA
        |
        ↓
Imóvel ALUGADO
```

Caso a negociação seja encerrada:

```text
Proposta CANCELADA ou REPROVADA
        |
        ↓
Imóvel DISPONIVEL
```

---

# Histórico das alterações

Todas as alterações realizadas pela máquina de estados são registradas na tabela:

```text
rental_proposal_logs
```

O histórico permite rastrear todas as movimentações realizadas durante o processo de locação.

São armazenadas informações como:

- Identificação da proposta;
- Imóvel relacionado;
- Usuário interessado;
- Proprietário do imóvel;
- Status atual do imóvel;
- Status atual da proposta;
- Mensagem da alteração;
- Data da atualização.

Exemplo:

```json
{
  "rentalProposalStatus": "ANALISE_CREDITO",
  "message": "A proposta foi atualizada para o status ANALISE_CREDITO",
  "updatedAt": "2026-07-09T10:00:00.000Z"
}
```

---

# Benefícios da implementação

A utilização da máquina de estados proporciona:

- Controle completo do ciclo de vida das propostas;
- Garantia das regras de transição;
- Prevenção de alterações inválidas;
- Separação da lógica de negócio;
- Facilidade para manutenção e evolução futura;
- Histórico completo das movimentações realizadas.

Dessa forma, a aplicação mantém um fluxo de locação seguro, previsível e preparado para novas regras de negócio.
