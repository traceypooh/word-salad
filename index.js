/* eslint-disable no-continue */

import http from 'http'
import { createReadStream, existsSync } from 'fs'

import { make_puzzle } from './pick-letters.js'
import { webpage } from './webpage.js'

// eslint-disable-next-line no-console
const log = console.log.bind(console)


/**
 * Outputs nice micro access.log like entry
 * @param string file  File being served
 * @param int code  HTTP status code
 */
function alog(file, code = 200) {
  log(`${new Date().toISOString().slice(0, 19).replace(/T/, ' ')} ${code} /${file || ''}`)
}


// Main web server
http.createServer((req, res) => {
  let type = 'text/html'
  let status = 200
  let pipe = true
  const file = req.url
    .slice(1) // nix lead /
    .replace(/^services\/clusters\//, '') // sigh - current way paths are proxy-passed to us

  switch (file) {
  // case '/node_modules/bootstrap/dist/js/bootstrap.min.js':

  case 'node_modules/bootstrap/dist/css/bootstrap.min.css':
    type = 'text/css'
    break

  case 'favicon.ico':
    type = 'image/x-icon'
    break

  case '':
    // Generate or regenerate at the top of every hour (extract "MM:S" from date string)
    // (kuberenetes health/liveness probes us ~every 10s)
    if (!existsSync('puzzle.json')  ||  new Date().toISOString().slice(14, 18) === '00:0')
      make_puzzle()

    pipe = false
    res.end(webpage())
    break

  default:
    status = 404
    pipe = false
    res.end(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body>
            🇫🇷 Merde, il n'y a rien ici! - Corentin`)
  }

  // static file - send it directly out
  alog(file)
  res.writeHead(status, { 'Content-Type': type })

  if (pipe)
    createReadStream(file).pipe(res)
}).listen(5000)

log('listenin')
