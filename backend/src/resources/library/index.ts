import * as fs from 'fs'
import * as log4js from 'log4js'
import { promisify } from 'util'
import { isEmpty } from 'lodash'

import { MainWordData } from '../gameSessionsManager'

const logger: log4js.Logger = log4js.getLogger('app')

export class LibraryNotLoadedError extends Error {}
export class LibraryNotInitialized extends Error {}

const readFile = promisify(fs.readFile)

class LibraryClass {
  private mainWordsIndex: MainWordData[] = []

  public getRandomMainWord(): MainWordData {
    if (isEmpty(this.mainWordsIndex)) {
      throw new LibraryNotInitialized('Library is not loaded')
    }

    const randomNum = Math.floor(Math.random() * this.mainWordsIndex.length)
    return this.mainWordsIndex[randomNum]
  }

  public async loadLibraryFromArray(
    libraryIndex: MainWordData[],
  ): Promise<void> {
    this.libraryLoadStart('array')
    this.mainWordsIndex = libraryIndex
    this.libraryLoadComplete()
  }

  public async loadLibraryFromFile(filename: string): Promise<void> {
    this.libraryLoadStart(filename)

    const rawData: string = await readFile(filename, 'utf8')
    this.mainWordsIndex = JSON.parse(rawData)

    this.libraryLoadComplete()
  }

  private libraryLoadStart(source: string): void {
    logger.warn(`Loading library from ${source}`)
  }

  private libraryLoadComplete(): void {
    logger.info(
      `Library loaded! ${this.mainWordsIndex.length} will be used as Main ones`,
    )
  }
}

export const Library = new LibraryClass()
