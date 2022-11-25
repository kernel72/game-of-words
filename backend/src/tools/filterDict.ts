import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { Word, MainWordData } from 'src/core/types'

const lineReader = readline.createInterface({
  input: fs.createReadStream(path.resolve('./dicts/hagen-morf.txt')),
})

let words: Word[] = []

type LettersMap = {
  [index: string]: number
}

const parseWord = (word: string): LettersMap => {
  const lettersMap: LettersMap = {}
  for (const letter of word) {
    if (lettersMap[letter] === undefined) {
      lettersMap[letter] = 0
    }
    lettersMap[letter]++
  }
  return lettersMap
}

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

  if (parsedOpts.length === 4) {
    ;[type, amount, , cse] = parsedOpts
  } else {
    ;[type, , amount, , cse] = parsedOpts
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
  // tslint:disable-next-line:no-console
  console.log('Dictionary loaded')
  // tslint:disable-next-line:no-console
  console.log('Sorting..')

  const mainWordsIndex: MainWordData[] = []

  words = words.sort((a, b) => (a.length > b.length ? -1 : 1))

  // tslint:disable-next-line:no-console
  console.log('Indexing..')
  words.forEach((word, i) => {
    // tslint:disable-next-line:no-console
    console.log(`Processing Word ${i + 1}/${words.length}\r`)
    mainWordsIndex.forEach(mainWordData => {
      if (word.length === mainWordData.mainWord.length) {
        return
      }
      const lettersAmount = parseWord(mainWordData.mainWord)

      for (const char of word) {
        const charsAmount = lettersAmount[char]
        if (charsAmount === undefined || charsAmount === 0) {
          return
        }
        lettersAmount[char]--
      }
      mainWordData.includedWords.push(word)
    })

    if (word.length > 13) {
      mainWordsIndex.push({
        mainWord: word,
        includedWords: [],
      })
    }
  })

  fs.writeFileSync(
    path.resolve(__dirname, 'words-rus-index.json'),
    JSON.stringify(mainWordsIndex),
  )
})
