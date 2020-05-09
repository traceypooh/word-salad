import { readFileSync } from 'fs'

// eslint-disable-next-line no-console
const log = console.log.bind(console)

function webpage() {
  const j = JSON.parse(readFileSync('puzzle.json'))
  log(j)

  const letters = j.letters.filter((e) => e !== j.center)

  return `
<link href="/node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="/css.css" rel="stylesheet" type="text/css"/>
<script src="/node_modules/jquery/dist/jquery.min.js"></script>
<script src="/client.js"></script>

<div class="container">
  <img class="logo" src="/logo.png"/>
  <h1>welcome to word salad</h1>

  <div class="ltrs">
    <div class="ltr">${j.center}</div>
    <div class="ltr">${letters.pop()}</div>
    <div class="ltr">${letters.pop()}</div>
    <div class="ltr">${letters.pop()}</div>
    <div class="ltr">${letters.pop()}</div>
    <div class="ltr">${letters.pop()}</div>
    <div class="ltr">${letters.pop()}</div>
  </div>

  <form id="form">
    <b>enter word:</b>
    <input class="input" type="text" value=""></input>

    <b>score:</b>
    <div id="score">0</div>
  </form>

  <div id="found">
  </div>

  <div class="card card-body bg-light">
    <ul>
      <li>today's puzzle contains ${j.words.length} "words"</li>
      <li>create words with 4 or more letters</li>
      <li>each word must contain '${j.center}'</li>
      <li>letters can be repeated</li>
      <li>1 point for 4 letter words</li>
      <li>each word longer than four letters gets an additional point per letter</li>
    </ul>
  </div>
</div>
`
}


// eslint-disable-next-line import/prefer-default-export
export { webpage }
