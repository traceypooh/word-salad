FROM denoland/deno:alpine

WORKDIR  /app
COPY . .

USER deno
CMD [ './index.js', '-p, 5000, '--no-dotfiles', '--no-dir-listing', '--cors' ]
