
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


function check(e) {
  const $inp = $(e.currentTarget).find('input')
  const submitted = $inp.val().trim()
  $inp.val('')
  log({ submitted })
  if (submitted in found)
    return

  if (submitted in words) {
    score += submitted.length - 3
    found[submitted] = true

    $('#score').html(score)
    $('#found').html(Object.keys(found).sort().join('<br>'))
  }
}

$(() => {
  $('#form').on('submit', (e) => {
    // eslint-disable-next-line no-console
    console.log('submitted', e)
    if ('init-me' in words) {
      $.getJSON('puzzle.json', (ret) => {
        log(ret)
        wipe(words)
        wipe(alls)
        for (const word of ret.words)
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
})
