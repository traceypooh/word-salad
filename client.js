
const words = { 'init-me': true }
const alls = { 'init-me': true }
const found = {}
let score = 0

// eslint-disable-next-line no-console
const log = console.log.bind(console)

/**
 * clears a JSON/hashmap to {}, logically
 * @param object map
 */
function wipe(map) {
  for (const prop of Object.getOwnPropertyNames(map))
    // eslint-disable-next-line no-param-reassign
    delete map[prop]
}


function check() {
  const $enter = $('#enter')
  const submitted = $enter.val().trim()
  $enter.val('')
  log({ submitted })
  if (submitted in found)
    return

  if (submitted in words) {
    score += (submitted.length > 4 ? submitted.length : 1)
    found[submitted] = true

    $('#found').html(Object.keys(found).sort().join('<br>'))
  }

  if (submitted in alls)
    score += 7

  $('#score').html(score)
}


function spoil() {
  const answers = []
  Object.keys(words).map((e) => answers.push(e in found ? e : `<i>${e in alls ? `<b>${e}</b>` : e}</i>`))
  $('#found').html(answers.join('<br>'))
}


$(() => {
  $('#enter').focus()

  $('#form').on('submit', (e) => {
    // eslint-disable-next-line no-console
    console.log('submitted', e)
    if ('init-me' in words) {
      $.getJSON('puzzle.json', (ret) => {
        log(ret)
        wipe(words)
        wipe(alls)
        for (const word of ret.words.sort())
          words[word] = true
        for (const all of ret.alls)
          alls[all] = true

        log({ score, alls, words })
        check(e)
      })
    } else {
      check(e)
    }

    return false
  })

  $('#spoil').on('click', spoil)
})
