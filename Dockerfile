FROM node:22-alpine

USER root

RUN apk update && apk add curl

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./

# 1. FORÇA a instalação de TODAS as dependências (mesmo as ferramentas de construção como o Vite)
RUN npm install --include=dev

COPY --chown=node:node . .

# 2. 👉 A INSTRUÇÃO MÁGICA: Constrói as telas do React (cria a pasta 'dist')
RUN npm run build

# 3. Só AGORA avisamos que estamos em produção, para o motor rodar mais rápido e seguro
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/server.js"]
