FROM node:alpine

RUN apk add  zsh  wget  jq  colordiff

COPY .   /app
WORKDIR  /app

RUN npm i

USER node
CMD [ "./node_modules/.bin/supervisor", "." ]
