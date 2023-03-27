#!/usr/bin/env -S deno run --location https://word-salad.archive.org --unstable --no-check --allow-read --allow-write=. --allow-net

import { existsSync } from 'https://deno.land/std/fs/mod.ts'
import httpd from 'https://deno.land/x/httpd/mod.js'

import { make_puzzle } from './pick-letters.js'
import { webpage } from './webpage.js'


// eslint-disable-next-line consistent-return
httpd((req, headers) => {
  if (new URL(req.url).pathname === '/') {
    // Generate or regenerate ~4am pactime
    // (nomad health/liveness probes us ~every 10s)
    if (!existsSync('puzzle.json')  ||  !Deno.lstatSync('puzzle.json').size  ||
        new Date().toISOString().slice(11, 18) === '11:10:0') {
      return make_puzzle().then(() => new Response(webpage(), { headers }))
    }
    return new Response(webpage(), { headers })
  }
}, { ls: false })
