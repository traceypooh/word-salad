// puzzle config
let p = {}

// state of game play
let score = 0
const state = {
  found: [],
  letters: '',
}


// eslint-disable-next-line no-console
const log = console.log.bind(console)


/**
 * Computes and returns score for given word
 * @param string word
 * @returns int
 */
function word_score(word) {
  if (!p.words.includes(word))
    return 0

  return (
    0 +
    (p.alls.includes(word) ? 7 : 0) +
    (word.length > 4 ? word.length : 1)
  )
}

function words_score(words) {
  return words.reduce((sum, e) => sum + word_score(e), 0)
}

function max_score() {
  return words_score(p.words)
}


function storage_name() {
  return `word-salad${(location.hostname === 'localhost' ? '-dev' : '')}`
}


function store_state() {
  if (typeof localStorage !== 'object')
    return

  localStorage.setItem(storage_name(), JSON.stringify(state))
}


function update() {
  store_state()
  const founds = state.found.sort()
  document.getElementById('found').innerHTML = founds.join('<br>')
  document.getElementById('score').innerHTML = score
  document.getElementById('nfound').innerHTML = founds.length
}


function restore_state() {
  if (typeof localStorage !== 'object')
    return

  // first, see if they are importing a puzzle via CGI args
  const cgi = new URLSearchParams(location.search)
  if (cgi.get('letters')) {
    state.letters = cgi.get('letters')
    state.found = cgi.get('found').split(',').filter((e) => word_score(e))
    store_state()
    // state saved -- now redirect them to url w/o CGI args, so that if they refresh the
    // page (w/ CGI args), they wont _revert_ and lose any further game progress.
    location.href = location.href.replace(/\?.*/, '')
  }

  const json = localStorage.getItem(storage_name())
  if (!json)
    return

  const stored = JSON.parse(json)
  // if the day's puzzle has changed and they reloaded the page, they're starting over
  if (stored.letters === p.letters.sort().join('')) {
    // same puzzle - restore it
    state.found = stored.found
    state.letters = p.letters.sort().join('')
    score = words_score(state.found)
    document.getElementById('msg').innerHTML = '<div class="alert alert-info">welcome back!</div>'
    update()
  } else {
    state.letters = p.letters.sort().join('')
  }
}


function msg(str, evt = null) {
  document.getElementById('msg').innerHTML = `<div class="alert alert-info">${str}</div>`

  // eslint-disable-next-line no-return-assign
  setTimeout(() => document.querySelector('#msg .alert').style.opacity = 0, 500)

  // eslint-disable-next-line no-unused-expressions
  evt && evt.preventDefault  && evt.preventDefault()
  // eslint-disable-next-line no-unused-expressions
  evt && evt.stopPropagation && evt.stopPropagation()
  return false
}


function enter(evt) {
  const $enter = document.getElementById('enter')
  const submitted = $enter.value.trim().toLowerCase()
  if (submitted === '')
    return false // to aid w/ iOS - as of now - we get 2 events a lot w/ 2nd as blank - ignore it

  $enter.value = ''
  log({ submitted })

  if (!submitted.includes(p.center))
    return msg(`${submitted} missing <b>${p.center.toUpperCase()}</b>`, evt)

  if (state.found.includes(submitted))
    return msg(`${submitted} already found`, evt)

  const scored = word_score(submitted)

  if (!scored)
    return msg(`${submitted} not in list`, evt)

  const pangram = p.alls.includes(submitted)

  const encouragment = (
    // eslint-disable-next-line no-nested-ternary
    pangram
      ? '🎉 you are AMAZING!! 🎉'
      : (
        // eslint-disable-next-line no-nested-ternary
        scored > 7
          ? '😍 OH SNAP!!'
          : (scored > 1
            ? '🚀 fantastic!'
            : '😎 nice!'
          )
      )
  )


  msg(`${encouragment}  <b>+${scored} pts</b>`)

  if (pangram) {
    // special commendation for a pangram!
    setTimeout(() => {
      document.querySelector('body').classList.add('flip')
      setTimeout(() => document.querySelector('body').classList.remove('flip'), 1200)
    }, 750)
  }

  score += scored
  state.found.push(submitted)

  update()

  // eslint-disable-next-line no-unused-expressions
  evt && evt.preventDefault  && evt.preventDefault()
  // eslint-disable-next-line no-unused-expressions
  evt && evt.stopPropagation && evt.stopPropagation()
  return false
}


function del1() {
  const $enter = document.getElementById('enter')
  $enter.value = $enter.value.slice(0, -1)
}


/**
 * Shuffles array in place. ES6 version
 * Note however, that swapping variables with destructuring assignment causes significant
 * performance loss, as of October 2017.
  *
 * @see https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}


function letter_pressed(evt) {
  const targ = evt.currentTarget
  const letter = targ.innerText
  targ.classList.add('pressed')
  setTimeout(() => targ.classList.remove('pressed'), 250)
  const val = `${document.getElementById('enter').value ?? ''}${letter}`
  document.getElementById('enter').value = val

  // eslint-disable-next-line no-unused-expressions
  evt && evt.preventDefault  && evt.preventDefault()
  // eslint-disable-next-line no-unused-expressions
  evt && evt.stopPropagation && evt.stopPropagation()
  return false
}


function add_letters() {
  const ltrs = shuffle(p.letters.filter((e) => e !== p.center))
  let htm = `<a class="ltr" href="#"><div>${p.center}</div></a>`
  while (ltrs.length)
    htm += `<a class="ltr" href="#"><div>${ltrs.pop()}</div></a>`

  document.querySelector('.ltrs').innerHTML = htm
  document.querySelectorAll('.ltr').forEach((e) => e.addEventListener('click', letter_pressed))
}


function spoil() {
  if (!document.querySelectorAll('#found i').length) {
    const answers = []
    p.words.map((e) => answers.push(state.found.includes(e) ? e : `<i>${p.alls.includes(e) ? `<b>${e} *</b>` : e}</i>`))
    document.getElementById('found').innerHTML = answers.join('<br>')
  } else {
    update()
  }
}


function transfer_url() {
  const url = `${location.href.replace(/\?.*/, '')}?letters=${state.letters}&found=${state.found.join(',')}`
  // eslint-disable-next-line no-alert
  alert(`BETA! copy this url to another device: ${url}`)
}

function help() {
  document.getElementById('help').innerHTML = `
    <li>
      today's puzzle contains <u>${p.words.length}</u> words
      <span id="nfound">0</span> discovered
    </li>
    <li>today's puzzle maximum score: <u>${max_score()}</u></li>
    <li>create words with 4 or more letters</li>
    <li>each word must contain: <div class="must">${p.center}</div></li>
    <li>letters can be repeated</li>
    <li>1 point for 4 letter words</li>
    <li>words longer than 4 letters get an additional point per letter</li>
    <li>a “pangram” - which uses every letter - is worth 7 extra points</li>
    <li>this puzzle contains <u>${p.alls.length}</u> pangrams</li>
  `
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('enter').focus()

  fetch('puzzle.json').then((e) => e.json()).then((ret) => {
    // copy to p
    p = ret
    log(p)

    help()
    add_letters()
    restore_state()
  })

  document.getElementById('form').addEventListener('submit', enter)
  document.getElementById('del1').addEventListener('click', del1)

  document.getElementById('shuffle').addEventListener('click', add_letters)
  document.getElementById('spoil').addEventListener('click', spoil)
  document.getElementById('transfer').addEventListener('click', transfer_url)
})
