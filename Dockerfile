FROM node:alpine

RUN apk add  zsh  wget  jq  colordiff

COPY .   /app
WORKDIR  /app

RUN npm i
RUN touch puzzle.json  &&  chmod 666 puzzle.json

USER node
CMD [ "./node_modules/.bin/supervisor", "." ]
