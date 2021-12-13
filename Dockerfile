FROM denoland/deno:alpine

# coreutils for `env -S`
RUN apk add coreutils

WORKDIR  /app
COPY . .

RUN chmod ugo-w *  &&  touch puzzle.json  &&  chmod 666 puzzle.json

USER deno
CMD [ './index.js', '-p, 5000, '--no-dotfiles', '--no-dir-listing', '--cors' ]
