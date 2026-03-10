FROM node:22-alpine

# Trabalhamos como 'root' (administrador) durante a construção para ter permissões totais
USER root

RUN apk update && apk add curl

WORKDIR /app

# Copia os arquivos de dependência primeiro (isso deixa o Railway muito mais rápido)
COPY package*.json ./

# Instala TODAS as dependências como administrador (sem limites de permissão)
RUN npm install

# Copia o resto do código da sua máquina para o servidor
COPY . .

# 👉 A INSTRUÇÃO MÁGICA: Constrói as telas do React (agora com poder para criar a pasta 'dist')
RUN npm run build

# Garante que o usuário 'node' seja o dono de tudo o que acabamos de gerar
RUN chown -R node:node /app

# Só agora, com tudo pronto, mudamos para o usuário seguro
USER node

# Avisamos que estamos em produção para o motor rodar mais rápido
ENV NODE_ENV=production

EXPOSE 3000

# Comando extra: mostra a lista de pastas nos logs (para vermos a 'dist' nascendo) antes de ligar o servidor!
CMD ["sh", "-c", "ls -la && node src/server.js"]
