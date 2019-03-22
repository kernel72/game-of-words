import * as fs from 'fs'
import * as readline from 'readline'
import * as log4js from 'log4js'
const logger: log4js.Logger = log4js.getLogger('app')

export class LibraryNotLoadedError extends Error {}
export class LibraryNotInitialized extends Error {}

class LibraryClass {
  private library: string[] = []

  public getRandomWord(): string {
    if (!this.library.length) {
      throw new LibraryNotInitialized('Library is not loaded')
    }

    const randomNum = Math.floor(
      Math.random() * Math.floor(this.library.length),
    )
    return this.library[randomNum]
  }

  public loadLibraryFromFile(filename: string): Promise<void> {
    logger.warn(`Loading library ${filename}`)

    return new Promise(resolve => {
      const lineReader = readline.createInterface({
        input: fs.createReadStream(filename),
      })

      lineReader.on('line', line => {
        this.library.push(line.trim())
      })

      lineReader.on('close', () => {
        resolve()
        logger.info(`Library loaded! ${this.library.length} words added`)
      })
    })
  }
}

export const Library = new LibraryClass()
