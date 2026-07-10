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
