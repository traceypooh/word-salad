FROM denoland/deno:alpine

RUN apk add  zsh  wget  jq  colordiff

WORKDIR  /app
COPY . .

RUN npm i
RUN touch puzzle.json  &&  chmod 666 puzzle.json

USER deno
CMD [ './index.js', '-p, 5000, '--no-dotfiles', '--cors' ]
