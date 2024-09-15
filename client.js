// puzzle config
const p = {}

const state = {
  found: {},
  score: 0,
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
  if (word in state.found)
    return 0

  if (!(word in p.words))
    return 0

  return (
    0 +
    (word in p.alls ? 7 : 0) +
    (word.length > 4 ? word.length : 1)
  )
}


function max_score() {
  return Object.keys(p.words).reduce((sum, e) => sum + word_score(e), 0)
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
  const founds = Object.keys(state.found).sort()
  document.getElementById('found').innerHTML = founds.join('<br>')
  document.getElementById('score').innerHTML = state.score
  document.getElementById('nfound').innerHTML = founds.length
}


function restore_state() {
  if (typeof localStorage !== 'object')
    return

  const json = localStorage.getItem(storage_name())
  if (!json)
    return

  const stored = JSON.parse(json)
  // if the day's puzzle has changed and they reloaded the page, they're starting over
  if (stored.letters === p.letters.sort().join('')) {
    // same puzzle - restore it
    state.found = stored.found
    state.score = stored.score
    state.letters = p.letters.sort().join('')
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

  if (submitted in state.found)
    return msg(`${submitted} already found`, evt)

  const score = word_score(submitted)

  if (!score)
    return msg(`${submitted} not in list`, evt)

  const pangram = (submitted in p.alls)

  const encouragment = (
    // eslint-disable-next-line no-nested-ternary
    pangram
      ? '🎉 you are AMAZING!! 🎉'
      : (
        // eslint-disable-next-line no-nested-ternary
        score > 7
          ? '😍 OH SNAP!!'
          : (score > 1
            ? '🚀 fantastic!'
            : '😎 nice!'
          )
      )
  )


  msg(`${encouragment}  <b>+${score} pts</b>`)

  if (pangram) {
    // special commendation for a pangram!
    setTimeout(() => {
      document.querySelector('body').classList.add('flip')
      setTimeout(() => document.querySelector('body').classList.remove('flip'), 1200)
    }, 750)
  }

  state.score += score
  state.found[submitted] = true

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
    Object.keys(p.words).map((e) => answers.push(e in state.found ? e : `<i>${e in p.alls ? `<b>${e} *</b>` : e}</i>`))
    document.getElementById('found').innerHTML = answers.join('<br>')
  } else {
    update()
  }
}


function help() {
  document.getElementById('help').innerHTML = `
    <li>
      today's puzzle contains <u>${Object.keys(p.words).length}</u> words
      <span id="nfound">0</span> discovered
    </li>
    <li>today's puzzle maximum score: <u>${max_score()}</u></li>
    <li>create words with 4 or more letters</li>
    <li>each word must contain: <div class="must">${p.center}</div></li>
    <li>letters can be repeated</li>
    <li>1 point for 4 letter words</li>
    <li>words longer than 4 letters get an additional point per letter</li>
    <li>a “pangram” - which uses every letter - is worth 7 extra points</li>
    <li>this puzzle contains <u>${Object.keys(p.alls).length}</u> pangrams</li>
  `
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('enter').focus()

  fetch('puzzle.json').then((e) => e.json()).then((ret) => {
    // logically copy to p
    for (const [k, v] of Object.entries(ret)) {
      if (['words', 'alls'].includes(k)) {
        // ... but switch these two from arrays to hashmaps
        p[k] = {}
        for (const word of ret[k].sort())
          p[k][word] = true
      } else {
        p[k] = v
      }
    }

    log(p)

    help()
    add_letters()
    restore_state()
  })

  document.getElementById('form').addEventListener('submit', enter)
  document.getElementById('del1').addEventListener('click', del1)

  document.getElementById('shuffle').addEventListener('click', add_letters)
  document.getElementById('spoil').addEventListener('click', spoil)
})
