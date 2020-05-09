
// puzzle config
const p = {}

const found = {}
let score = 0

// eslint-disable-next-line no-console
const log = console.log.bind(console)

function enter() {
  const $enter = $('#enter')
  const submitted = $enter.val().trim()
  $enter.val('')
  log({ submitted })
  if (submitted in found)
    return false

  if (submitted in p.words) {
    score += (submitted.length > 4 ? submitted.length : 1)
    found[submitted] = true

    $('#found').html(Object.keys(found).sort().join('<br>'))
  }

  if (submitted in p.alls)
    score += 7

  $('#score').html(score)
  return false
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


function add_letters() {
  const ltrs = shuffle(p.letters.filter((e) => e !== p.center))
  $('.ltrs').html(`
    <div class="ltr">${p.center}</div>
    <div class="ltr">${ltrs.pop()}</div>
    <div class="ltr">${ltrs.pop()}</div>
    <div class="ltr">${ltrs.pop()}</div>
    <div class="ltr">${ltrs.pop()}</div>
    <div class="ltr">${ltrs.pop()}</div>
    <div class="ltr">${ltrs.pop()}</div>
  `)
}


function spoil() {
  const answers = []
  Object.keys(p.words).map((e) => answers.push(e in found ? e : `<i>${e in p.alls ? `<b>${e}</b>` : e}</i>`))
  $('#found').html(answers.join('<br>'))
}


function help() {
  $('#help').html(`
    <div class="card card-body bg-light">
      <ul>
        <li>today's puzzle contains ${Object.keys(p.words).length} "words"</li>
        <li>create words with 4 or more letters</li>
        <li>each word must contain '${p.center}'</li>
        <li>letters can be repeated</li>
        <li>1 point for 4 letter words</li>
        <li>words longer than four letters get an additional point per letter</li>
        <li>a “pangram” - which uses every letter - is worth 7 extra points</li>
        <li>this puzzle contains ${Object.keys(p.alls).length} pangrams</li>
      </ul>
    </div>
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
  })

  $('#form').on('submit', enter)

  $('#shuffle').on('click', add_letters)

  $('#spoil').on('click', spoil)
})
