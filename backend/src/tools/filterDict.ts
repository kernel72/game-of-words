import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { Word } from 'src/core/types'

const lineReader = readline.createInterface({
  input: fs.createReadStream(
    path.resolve(__dirname, '../dicts/hagen-morf.txt'),
  ),
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
  const [type, _, amount, gender, cse] = opts.trim().split(' ')

  if (
    type.trim() !== 'сущ' ||
    (amount && amount.trim() !== 'ед') ||
    (gender && gender.trim() !== 'муж') ||
    (cse && cse.trim() !== 'им')
  ) {
    return
  }

  if (word.length < 14) {
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
