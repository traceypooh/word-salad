
function webpage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>word salad word game</title>
  <meta charset="UTF-8">
  <meta name="description"
    content="spelling letter and word puzzle - similar to NY Times Spelling Bee https://www.nytimes.com/puzzles/spelling-bee but all hand-made..."/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>
<link href="/node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="/css.css" rel="stylesheet" type="text/css"/>
<script src="/node_modules/jquery/dist/jquery.min.js"></script>
<script src="/client.js" type="module"></script>

<div class="container">
  <img class="logo" src="/logo.png"/>
  <h1>welcome to word salad 📖 🥗</h1>

  <div class="ltrs">
  </div>

  <form id="form">
    <b>enter word:</b>
    <input class="input" type="text" id="enter"></input>

    <b>score:</b>
    <div id="score">0</div>

    <input class="btn btn-sm btn-primary" type="submit" value="enter"></input>
    <input class="btn btn-sm btn-info"    type="button" id="shuffle" value="shuffle"></input>
    <input class="btn btn-sm btn-danger"  type="button" id="spoil"   value="spoiler"></input>
  </form>

  <div id="found">
  </div>

  <div class="card card-body bg-light">
    <ul id="help">
    </ul>
  </div>

  <div id="cite" class="card card-body bg-light">
    🐝 very similar to
    <a href="https://www.nytimes.com/puzzles/spelling-bee">
      NY Times Spelling Bee
    </a>
    but all hand-made...
  </div>
</div>
</body></html>
`
}

// eslint-disable-next-line import/prefer-default-export
export { webpage }
