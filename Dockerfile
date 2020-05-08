FROM node:alpine

COPY .   /app
WORKDIR  /app

# RUN apk add  zsh  wget  jq  colordiff  colordiff

RUN npm i

USER node
CMD node --input-type=module -e "import http from 'http'; http.createServer((req, res) => res.end('hai')).listen(5000)"
