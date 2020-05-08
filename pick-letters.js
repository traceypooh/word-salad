/* eslint-disable no-continue */

import { basename } from 'path'
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

const SIZE = 7

// eslint-disable-next-line no-console
const log = console.log.bind(console)

// letters to count of their tiles in scrabble (excluding blank tile ;-)
const LETTERS = {
  a: 9,
  b: 2,
  c: 2,
  d: 4,
  e: 12,
  f: 2,
  g: 3,
  h: 2,
  i: 9,
  j: 1,
  k: 1,
  l: 4,
  m: 2,
  n: 6,
  o: 8,
  p: 2,
  q: 1,
  r: 6,
  s: 4,
  t: 6,
  u: 4,
  v: 2,
  w: 2,
  x: 1,
  y: 2,
  z: 1,
}

function random_letter() {
  // The sum of all weights is 98
  // The ratio of each weight to that sum is the frequency of the letter.
  // For 12 E tiles, E’s frequency is 12/98, or 12.2%.
  const total_weight = Object.values(LETTERS).reduce((tot, num) => tot + num)

  let random = Math.floor(Math.random() * total_weight)

  for (const [letter, count] of Object.entries(LETTERS)) {
    // log({ letter, count, random })
    random -= count

    if (random < 0)
      return letter
  }

  return undefined
}


function create() {
  // now pick letters
  //   we have to include at least 1 vowel
  //   we never want repeats or more than 2 vowels ;-)
  let letters = []
  let vowels = 0
  while (letters.length < SIZE  ||  !vowels) {
    const letter = random_letter()

    // ensure 1 or 2 vowels only
    const vowel = ['a', 'e', 'i', 'o', 'u'].includes(letter)
    if (vowel) {
      vowels += 1
      if (vowels > 2)
        continue
    }

    if (letter === 'q') {
      // no Q w/o U
      if (vowels > 2)
        continue
      letters.push('u')
      vowels += 1
    }

    letters.push(letter)
    // filter through Set to dedupe
    letters = [...new Set(letters)]
    // log({ letters })
  }

  // The only reason there are more than SIZE letters is took awhile to get a vowel (at the end).
  // So shrink the front
  while (letters.length > SIZE)
    letters.shift()

  // now pick the central letter
  const consonants = letters.filter((e) => !['a', 'e', 'i', 'o', 'u'].includes(e))

  const center = consonants[Math.floor(Math.random() * consonants.length)]
  // log({ consonants, center, letters })


  // now filter words dictionary to just the words made up of the limited letters,
  // where each word _additionally_ has to contain center letter.
  const cmd = `egrep '^[${letters.join('')}]+$' words.txt |fgrep ${center}`
  // log({ cmd })
  const words = execSync(cmd).toString().trimEnd().split('\n')

  // find the words that have _all letters_ in them
  const alls = []
  for (const word of words) {
    if ([...new Set(word.split(''))].join('').length === SIZE)
      alls.push(word)
  }

  return {
    letters, center, words, alls,
  }
}


function make_puzzle() {
  // keep trying until we get at least one word w/ all the letters
  let puzzle
  do {
    puzzle = create()
    process.stdout.write('.')
    execSync('sleep .1') // avoid CPU meltdown
  } while (!puzzle.alls.length)

  writeFileSync('puzzle.json', JSON.stringify(puzzle))

  log({ puzzle })
}


if (basename(process.argv[1]) === 'pick-letters.js') {
  log('CLI DETECTED')
  make_puzzle()
}


// eslint-disable-next-line import/prefer-default-export
export { make_puzzle }
