
import $ from 'https://esm.archive.org/jquery'

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
  $('#found').html(founds.join('<br>'))
  $('#score').html(state.score)
  $('#nfound').html(founds.length)
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
    $('#msg').html('<div class="alert alert-info">welcome back!</div>')
    update()
  } else {
    state.letters = p.letters.sort().join('')
  }
}


function msg(str) {
  $('#msg').html(
    `<div class="alert alert-info">${str}</div>`,
  )
  setTimeout(() => $('#msg .alert').css('opacity', 0), 500)
  return false
}


function enter() {
  const $enter = $('#enter')
  const submitted = $enter.val().trim().toLowerCase()
  if (submitted === '')
    return false // to aid w/ iOS - as of now - we get 2 events a lot w/ 2nd as blank - ignore it

  $enter.val('')
  log({ submitted })

  if (!submitted.includes(p.center))
    return msg(`${submitted} missing <b>${p.center.toUpperCase()}</b>`)

  if (submitted in state.found)
    return msg(`${submitted} already found`)

  const score = word_score(submitted)

  if (!score)
    return msg(`${submitted} not in list`)

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
      $('body').addClass('flip')
      setTimeout(() => $('body').removeClass('flip'), 1200)
    }, 750)
  }

  state.score += score
  state.found[submitted] = true

  update()
  return false
}


function del1() {
  const $enter = $('#enter')
  $enter.val($enter.val().slice(0, -1))
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
  const $targ = $(evt.currentTarget)
  const letter = $targ.text()
  $targ.addClass('pressed')
  setTimeout(() => $targ.removeClass('pressed'), 250)
  const val = $('#enter').val().concat(letter)
  $('#enter').val(val)

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

  $('.ltrs').html(htm)

  $('.ltr').on('click', letter_pressed)
}


function spoil() {
  if (!$('#found i').length) {
    const answers = []
    Object.keys(p.words).map((e) => answers.push(e in state.found ? e : `<i>${e in p.alls ? `<b>${e} *</b>` : e}</i>`))
    $('#found').html(answers.join('<br>'))
  } else {
    update()
  }
}


function help() {
  $('#help').html(`
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
  `)
}


$(() => {
  $('#enter').focus()

  $.getJSON('puzzle.json', (ret) => {
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

  $('#form').on('submit', enter)
  $('#del1').on('click', del1)

  $('#shuffle').on('click', add_letters)

  $('#spoil').on('click', spoil)
})
