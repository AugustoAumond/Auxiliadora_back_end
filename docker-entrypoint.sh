#!/bin/sh
set -eu

echo "Sincronizando dependências do container..."
npm ci

echo "Gerando Prisma Client..."
npx prisma generate

npx prisma migrate deploy

exec npm run dev
