#docker do meu backend Node.js

FROM node:22-alpine

USER root

RUN apk update && apk add curl

ENV NODE_ENV=production


WORKDIR /app


RUN chown -R node:node /app


USER node


COPY --chown=node:node package*.json ./


RUN npm install


COPY --chown=node:node . .


EXPOSE 3000


CMD ["node", "src/server.js"]