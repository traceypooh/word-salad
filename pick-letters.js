/* eslint-disable no-continue */

import { basename } from 'https://deno.land/std/path/mod.ts'
import { writeAllSync } from 'https://deno.land/std/io/write_all.ts'
import { sleep } from 'https://deno.land/x/sleep/mod.ts'

const SIZE = 7
const MIN_WORDS =  50
const MAX_WORDS = 150

// you can switch this to a specific letters/center set if desired
const SPECIFIC_GAME = false // { letters: 'hoifwtr'.split(''), center: 'r' }


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
  // s: 4, // to avoid spurious plurals, it seems this is never used
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


function get_letters() {
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

  let center
  do {
    center = consonants[Math.floor(Math.random() * consonants.length)]
  } while (center === 'q'  ||  center === 'j'  ||  center === 'z') // avoid super-tough center ltrs
  // log({ consonants, center, letters })

  if (SPECIFIC_GAME)
    return SPECIFIC_GAME

  return { letters, center }
}


function create() {
  const { letters, center } = get_letters()

  // now filter words dictionary to just the words made up of the limited letters,
  // where each word _additionally_ has to contain center letter.
  const words = Deno.readTextFileSync('./words.txt')
    .trimEnd()
    .split('\n')
    .filter((e) => e.match(RegExp(`^[${letters.join('')}]+$`)))
    .filter((e) => e.includes(center))

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


async function make_puzzle() {
  // keep trying until we get at least one word w/ all the letters,
  // and also neither too few nor too many words
  let puzzle
  do {
    puzzle = create()
    writeAllSync(Deno.stdout, new TextEncoder().encode('.'))
    await sleep(0.1) // avoid CPU meltdown
  } while (
    !puzzle.alls.length || puzzle.words.length < MIN_WORDS || puzzle.words.length > MAX_WORDS
  )

  Deno.writeTextFileSync('puzzle.json', JSON.stringify(puzzle))

  log({ puzzle })
}


async function main() {
  if (basename(Deno.mainModule) === 'pick-letters.js') {
    log('CLI DETECTED')
    await make_puzzle()
  }
}

// eslint-disable-next-line no-void
void main()


// eslint-disable-next-line import/prefer-default-export
export { make_puzzle }
