FROM denoland/deno:alpine

# coreutils for `env -S`
RUN apk add coreutils

WORKDIR  /app
COPY . .

RUN chmod ugo-w *  &&  touch puzzle.json  &&  chmod 666 puzzle.json && \
    deno cache index.js

USER deno
CMD [ "./index.js", "--watch" ]
