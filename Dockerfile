# TENTEI FAZER A CONFIGURAÇÃO DA DOCKER MAS COMO FALTAVA POUCO TEMPO NÃO CONSEGUI TERMINAR A TEMPO;
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3333

COPY docker-entrypoint.sh .

RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]