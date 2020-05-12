import * as fs from 'fs'
import * as readline from 'readline'
import * as log4js from 'log4js'
import { isEmpty } from 'lodash'

import { Word } from './types'

const logger: log4js.Logger = log4js.getLogger('app')

export class LibraryNotLoadedError extends Error {}
export class LibraryNotInitialized extends Error {}

class LibraryClass {
  private library: Word[] = []
  private mainWords: Word[] = []

  public getRandomMainWord(): Word {
    if (isEmpty(this.mainWords)) {
      throw new LibraryNotInitialized('Library is not loaded')
    }

    const randomNum = Math.floor(Math.random() * this.mainWords.length)
    return this.mainWords[randomNum]
  }

  public doesWordExist(word: Word): boolean {
    if (isEmpty(this.library)) {
      throw new LibraryNotInitialized('Library is not loaded')
    }
    return this.library.includes(word)
  }

  public async loadLibraryFromArray(words: Word[]): Promise<void> {
    this.libraryLoadStart('array')
    this.library = words
    this.libraryLoadComplete()
  }

  public async loadLibraryFromFile(filename: string): Promise<void> {
    this.libraryLoadStart(filename)

    return new Promise(resolve => {
      const lineReader = readline.createInterface({
        input: fs.createReadStream(filename),
      })

      lineReader.on('line', line => {
        const word = line.trim()
        this.library.push(word)
        if (word.length > 13) {
          this.mainWords.push(word)
        }
      })

      lineReader.on('close', () => {
        resolve()
        this.libraryLoadComplete()
      })
    })
  }

  private libraryLoadStart(source: string): void {
    logger.warn(`Loading library from ${source}`)
  }

  private libraryLoadComplete(): void {
    logger.info(
      `Library loaded! ${this.library.length} words added. ${this.mainWords.length} will be used as Main ones`,
    )
  }
}

export const Library = new LibraryClass()
