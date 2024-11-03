#!/usr/bin/env -S deno run --location https://word-salad.archive.org --no-check --allow-read --allow-write=. --allow-net --allow-import

/* eslint-disable no-continue */

import { writeAllSync } from 'https://deno.land/std/io/write_all.ts'
import { sleep } from 'https://deno.land/x/sleep/mod.ts'

import setup_puzzle from './client.js'

const SIZE = 7
const MIN_WORDS =  50
const MAX_WORDS = 150
const NUMBER_PUZZLES = 366 * 3

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


async function main() {
  await Deno.writeTextFile('puzzles.txt', '')
  const made = {}
  do {
    // keep trying until we get at least one word w/ all the letters,
    // and also neither too few nor too many words
    let puzzle
    do {
      const { letters, center } = get_letters()
      puzzle = await setup_puzzle(letters, center)
      writeAllSync(Deno.stdout, new TextEncoder().encode('.'))
      await sleep(0.03) // avoid CPU meltdown
    } while (
      !puzzle.alls.length || puzzle.words.length < MIN_WORDS || puzzle.words.length > MAX_WORDS
    )

    const { letters, center } = puzzle
    const chars = `${center}${letters.filter((e) => e !== center).join('')}`
    if (chars in made)
      continue
    made[chars] = 1

    log({ puzzle })
    await Deno.writeTextFile('puzzles.txt', `${chars}\n`, { create: true, append: true })
  } while (Object.keys(made).length < NUMBER_PUZZLES)
}

// eslint-disable-next-line no-void
void main()
