
function webpage() {
  return `
<link href="/node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<link href="/css.css" rel="stylesheet" type="text/css"/>
<script src="/node_modules/jquery/dist/jquery.min.js"></script>
<script src="/client.js" type="module"></script>

<div class="container">
  <img class="logo" src="/logo.png"/>
  <h1>welcome to word salad</h1>

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

  <div id="help">
  </div>
`
}

// eslint-disable-next-line import/prefer-default-export
export { webpage }
