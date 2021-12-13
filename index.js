#!/usr/bin/env -S deno run --location https://word-salad.archive.org --unstable --no-check --allow-read --allow-write=. --allow-net

import { existsSync } from 'https://deno.land/std/fs/mod.ts'
import main from 'https://raw.githubusercontent.com/traceypooh/deno_std/main/http/file_server.ts'

import { make_puzzle } from './pick-letters.js'
import { webpage } from './webpage.js'


// dynamic part of the web server
async function handler(req) {
  const headers = new Headers()
  headers.append('content-type', 'text/html')

  const url = new URL(req.url)

  if (url.pathname === '/') {
    // Generate or regenerate ~4am pactime
    // (nomad health/liveness probes us ~every 10s)
    if (!existsSync('puzzle.json')  ||  !Deno.lstatSync('puzzle.json').size  ||
        new Date().toISOString().slice(11, 18) === '11:10:0') {
      await make_puzzle()
    }

    return Promise.resolve(new Response(webpage(), { status: 200, headers }))
  }

  return Promise.resolve(new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body>
    🇫🇷 Merde, il n'y a rien ici! - Corentin`,
    { status: 404, headers },
  ))
}

main(handler)
