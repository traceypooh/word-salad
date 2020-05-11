FROM node:alpine

RUN apk add  zsh  wget  jq  colordiff

COPY .   /app
WORKDIR  /app

RUN ln -s  /av/env/zshrc    /home/node/.zshrc  &&  \
    ln -s  /av/env/aliases  /home/node/.aliases

RUN npm i
RUN touch puzzle.json  &&  chmod 666 puzzle.json

# USER node
CMD [ "./node_modules/.bin/supervisor", "." ]
