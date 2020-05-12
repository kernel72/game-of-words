import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { Word } from 'src/core/types'

const lineReader = readline.createInterface({
  input: fs.createReadStream(path.resolve('./dicts/hagen-morf.txt')),
})

const words: Word[] = []

lineReader.on('line', line => {
  line = line.trim()
  if (!line.length) {
    return
  }

  // tslint:disable
  let [word, opts] = line.split('|')
  // tslint:enable

  word = word.trim()
  const parsedOpts = opts.trim().split(' ')

  let type
  let amount
  let cse
  let kind
  let liveNotLive

  if (parsedOpts.length === 4) {
    ;[type, amount, kind, cse] = parsedOpts
  } else {
    ;[type, liveNotLive, amount, kind, cse] = parsedOpts
  }

  if (
    type.trim() !== 'сущ' ||
    (amount && amount.trim() !== 'ед') ||
    (cse && cse.trim() !== 'им')
  ) {
    return
  }

  const hasBadChars = word
    .split('')
    .some(l => l.toUpperCase() === l.toLowerCase())

  if (hasBadChars) {
    return
  }
  words.push(word)
})

lineReader.on('close', () => {
  fs.writeFileSync(path.resolve(__dirname, 'words-rus.txt'), words.join('\n'))
})
