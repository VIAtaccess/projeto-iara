FROM node:22-alpine

# Trabalhamos como administrador durante a construção
USER root
RUN apk update && apk add curl

WORKDIR /app

# Copia todos os arquivos e pastas da sua máquina para o servidor
COPY . .

# 1. Instala as dependências da pasta principal (do Motor Backend)
RUN npm install

# 2. 👉 AUTO-BUILDER MÁGICO: Procura a subpasta do React, entra nela e constrói as telas!
RUN sh -c '\
    for f in $(find . -name "package.json" -not -path "*/node_modules/*"); do \
        if grep -q "\"vite\"" "$f"; then \
            FRONT_DIR=$(dirname "$f"); \
            echo "=> 🎨 Tela React encontrada na pasta: $FRONT_DIR"; \
            cd "$FRONT_DIR"; \
            npm install --include=dev; \
            npm run build; \
            if [ "$FRONT_DIR" != "." ]; then \
                echo "=> 🚚 Movendo as telas prontas para a raiz do servidor..."; \
                cp -R dist /app/ || true; \
            fi; \
            cd /app; \
        fi; \
    done \
'

# Garante que o usuário 'node' seja dono de tudo
RUN chown -R node:node /app

# Volta para o usuário seguro
USER node

# Avisamos que estamos em produção
ENV NODE_ENV=production

EXPOSE 3000

# Liga o servidor!
CMD ["node", "src/server.js"]
