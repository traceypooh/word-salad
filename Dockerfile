FROM denoland/deno:alpine

# coreutils for `env -S`
RUN apk add coreutils

WORKDIR  /app
COPY . .

USER deno
CMD [ './index.js', '-p, 5000, '--no-dotfiles', '--no-dir-listing', '--cors' ]
