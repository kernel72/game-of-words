import * as fs from 'fs'
import * as readline from 'readline'
import * as log4js from 'log4js'
import { Word } from './types'
const logger: log4js.Logger = log4js.getLogger('app')

export class LibraryNotLoadedError extends Error {}
export class LibraryNotInitialized extends Error {}

class LibraryClass {
  private library: Word[] = []

  public getRandomWord(): Word {
    if (!this.library.length) {
      throw new LibraryNotInitialized('Library is not loaded')
    }

    const randomNum = Math.floor(Math.random() * this.library.length)
    return this.library[randomNum]
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
        this.library.push(line.trim())
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
    logger.info(`Library loaded! ${this.library.length} words added`)
  }
}

export const Library = new LibraryClass()
